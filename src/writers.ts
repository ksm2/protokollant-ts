import { Changelog } from './Changelog'
import { MarkdownDocument } from './MarkdownDocument'
import { Release } from './Release'

function upperCaseFirst(str: string): string {
  if (str.length < 2) return str.toUpperCase()
  return str[0].toUpperCase() + str.substring(1)
}

export function writeRelease(document: MarkdownDocument, release: Release): void {
  const heading = []
  if (release.getLink()) {
    heading.push(document.link(release.getName(), release.getLink()!))
  } else {
    heading.push(release.getName())
  }
  if (release.getDate()) {
    heading.push(release.getDate()!)
  }
  document.h2(heading.join(' - '))
  if (release.getDescription()) {
    document.paragraph(release.getDescription())
    document.paragraph('')
  }

  for (const [category, items] of release.getSortedItems()) {
    document.h3(upperCaseFirst(category))
    for (const item of items) {
      document.listItem(item)
    }
  }
}

export function writeChangelog(document: MarkdownDocument, changelog: Changelog): void {
  document.h1(changelog.getHeading())
  document.paragraph(changelog.getDescription())

  for (const release of changelog.getReleases()) {
    writeRelease(document, release)
  }
}
