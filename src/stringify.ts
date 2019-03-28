import { Changelog } from './Changelog'

function upperCaseFirst(str: string): string {
  if (str.length < 2) return str.toUpperCase()
  return str[0].toUpperCase() + str.substring(1)
}

export function stringify(changelog: Changelog): string {
  let output = ''
  let links = ''

  output += `# ${changelog.getHeading()}\n`
  output += changelog.getDescription()

  for (const release of changelog.getReleases()) {
    if (release.getLink()) {
      output += `## [${release.getName()}]`
      links += `[${release.getName()}]: ${release.getLink()}\n`
    } else {
      output += `## ${release.getName()}`
    }
    if (release.getDate()) {
      output += ` - ${release.getDate()}`
    }
    output += '\n'

    for (const [category, items] of release.getItems()) {
      output += `### ${upperCaseFirst(category)}\n`
      for (const item of items)
        output += `- ${item}\n`
      output += '\n'
    }
  }

  if (links) {
    output += '\n'
    output += links
  }

  return output
}
