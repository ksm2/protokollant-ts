import { Changelog } from './Changelog'
import { Release } from './Release'

function detectConfig(changelog: Changelog, refMap: Map<string, string>): void {
  if (!refMap.size) return
  let prefix: string | null = null

  for (const [version, link] of refMap) {
    if (!prefix) {
      const index = link.lastIndexOf('/')
      if (index < 0) return

      prefix = link.substring(0, index + 1)
    }

    if (!link.startsWith(prefix)) return

    const postfix = link.substring(prefix.length)
    const match = postfix.match(/^.*?\.\.\.(.*)$/)

    if (match) {
      const [, to] = match
      if (version === 'Unreleased') {
        changelog.setUnreleasedBranch(to)
      } else {
        const index = to.indexOf(version)
        if (index >= 0) {
          changelog.setTagPrefix(to.substring(0, index))
        }
      }
    }
  }

  changelog.setLinkPrefix(prefix)
}

export function parseChangelog(changelogStr: string): Changelog {
  const lines = changelogStr.split(/\r\n|[\r\n]/g)
  const changelog = new Changelog()
  const refMap = new Map<string, string>()
  let release: Release | null = null
  let category: string | null = null
  let description = ''

  const addRelease = () => {
    if (release) {
      changelog.addRelease(release)
      release = null
    }
  }

  let match: RegExpMatchArray | null
  let i = 1
  for (const line of lines) {
    if ((match = line.match(/^#\s+(.*)\s*$/))) {
      changelog.setHeading(match[1])
    } else if ((match = line.match(/^\[([^\]]+)]:\s+(.*)$/))) {
      refMap.set(match[1], match[2])
    } else if ((match = line.match(/^##\s+\[?([^\]]+?)]?(?:\s+-\s*(.*))?$/))) {
      addRelease()
      const [, name, date = null] = match
      release = new Release(name)
      release.setDate(date)
    } else if ((match = line.match(/^###\s+(.+)$/))) {
      category = match[1].toLowerCase()

      if (!release) throw new TypeError(`Missing release for category "${category}" in line ${i}`)

      if (typeof release[category] !== 'function')
        throw new TypeError(`Unsupported category type "${category}" in line ${i}`)
    } else if ((match = line.match(/^[-*]\s+(.*)$/))) {
      if (!release || !category) throw new TypeError(`Missing release or category in line ${i}`)

      release[category](match[1])
    } else if (!release) {
      description += `${line}\n`
    }

    i += 1
  }

  addRelease()

  for (const release of changelog.getReleases()) {
    const link = refMap.get(release.getName())
    if (link) {
      release.setLink(link)
    }
  }

  changelog.setDescription(description.trimEnd())
  detectConfig(changelog, refMap)

  return changelog
}
