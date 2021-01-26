import { MarkdownDocument } from './MarkdownDocument'
import { Release } from './Release'
import { writeRelease } from './writers'

export function printRelease(release: Release): string {
  const document = new MarkdownDocument()
  writeRelease(document, release)
  return document.toString()
}
