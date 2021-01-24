export class MarkdownDocument {
  private readonly _lines: string[] = []
  private readonly _references: string[] = []

  h1(heading: string): void {
    this.ensureEmptyLine()
    this._lines.push(`# ${heading}`)
  }

  h2(heading: string) {
    this.ensureEmptyLine()
    this._lines.push(`## ${heading}`)
  }

  h3(heading: string) {
    this._lines.push(`### ${heading}`)
  }

  private ensureEmptyLine() {
    if (this._lines.length === 0) {
      return
    }
    if (this._lines[this._lines.length - 1].length > 0) {
      this._lines.push('')
    }
  }

  paragraph(text: string): void {
    this._lines.push(text.trimEnd())
  }

  listItem(line: string) {
    this._lines.push(`- ${line}`)
  }

  link(text: string, reference: string): string {
    this.addReference(text, reference)
    return `[${text}]`
  }

  private addReference(text: string, link: string): void {
    this._references.push(`[${text}]: ${link}`)
  }

  toString(): string {
    if (this._references.length > 0) {
      this._lines.push('', '', ...this._references.splice(0))
    }
    return this._lines.join('\n').trimEnd() + '\n'
  }
}
