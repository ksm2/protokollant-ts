export interface MarkdownH1 {
  type: 'h1'
  content: MarkdownContent[]
}

export interface MarkdownH2 {
  type: 'h2'
  content: MarkdownContent[]
}

export interface MarkdownH3 {
  type: 'h3'
  content: MarkdownContent[]
}

export interface MarkdownListItem {
  type: 'listItem'
  content: MarkdownContent[]
}

export interface MarkdownReference {
  type: 'reference'
  text: string
  href: string
}

export type MarkdownItem =
  | MarkdownH1
  | MarkdownH2
  | MarkdownH3
  | MarkdownListItem
  | { type: 'p'; content: MarkdownContent[] }
  | MarkdownReference

export type MarkdownContent =
  | { type: 'newLine' }
  | { type: 'text'; content: string }
  | { type: 'link'; text: string; href?: string }

function parseContent(raw: string): MarkdownContent[] {
  let match: RegExpMatchArray | null
  if ((match = raw.match(/^([^\[]+)(.*)$/)) !== null) {
    const [, content, rest] = match
    return [{ type: 'text', content }, ...parseContent(rest)]
  } else if ((match = raw.match(/^\[([^\]]+)]\(([^)]*)\)(.*)$/))) {
    const [, text, href, rest] = match
    return [{ type: 'link', text, href }, ...parseContent(rest)]
  } else if ((match = raw.match(/^\[([^\]]+)](.*)$/))) {
    const [, text, rest] = match
    return [{ type: 'link', text }, ...parseContent(rest)]
  }

  return [{ type: 'newLine' }]
}

export function parseMarkdown(markdown: string): MarkdownItem[] {
  const lines = markdown.split(/\r\n|[\r\n]/g)
  const result: MarkdownItem[] = []

  for (const line of lines) {
    let match: RegExpMatchArray | null
    if ((match = line.match(/^(#{1,3})\s+(.*)\s*$/)) !== null) {
      const [, headingLevel, rawContent] = match
      const type = `h${headingLevel.length}` as 'h1' | 'h2' | 'h3'
      const content = parseContent(rawContent)
      result.push({ type, content })
    } else if ((match = line.match(/^(?:[-+*])\s+(.*)\s*$/)) !== null) {
      const [, rawContent] = match
      const content = parseContent(rawContent)
      result.push({ type: 'listItem', content })
    } else if ((match = line.match(/^\[([^]+)]:\s+(.*)\s*$/)) !== null) {
      const [, text, href] = match
      result.push({ type: 'reference', text, href })
    } else {
      const content = parseContent(line)
      result.push({ type: 'p', content })
    }
  }

  return result
}
