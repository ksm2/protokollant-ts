import { Changelog } from './Changelog'
import { MarkdownDocument } from './MarkdownDocument'
import { writeChangelog } from './writers'

export function printChangelog(changelog: Changelog): string {
  const document = new MarkdownDocument()
  writeChangelog(document, changelog)
  return document.toString()
}
