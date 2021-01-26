import { Changelog } from './Changelog'
import {
  MarkdownContent,
  MarkdownH1,
  MarkdownH2,
  MarkdownH3,
  MarkdownItem,
  MarkdownListItem,
  MarkdownReference,
  parseMarkdown,
} from './parseMarkdown'
import { Release } from './Release'

function contentToString(contents: MarkdownContent[]): string {
  return contents.reduce((acc, content) => {
    switch (content.type) {
      case 'newLine':
        return acc + '\n'
      case 'link':
        if (content.href) {
          return acc + `[${content.text}](${content.href})`
        }
        return acc + `[${content.text}]`
      case 'text':
        return acc + content.content
    }
  }, '')
}

function itemsToString(items: MarkdownItem[]): string {
  return items.reduce((acc, item) => {
    switch (item.type) {
      case 'p': {
        return acc + contentToString(item.content)
      }
      case 'listItem': {
        return acc + `- ${contentToString(item.content)}`
      }
      default: {
        return acc
      }
    }
  }, '')
}

interface Subsection {
  heading: MarkdownContent[]
  article: MarkdownItem[]
}

interface Section extends Subsection {
  subsections: Subsection[]
}

interface Document extends Subsection {
  sections: Section[]
}

class Parser {
  private readonly markdown: MarkdownItem[]
  private index = 0

  constructor(markdown: MarkdownItem[]) {
    this.markdown = markdown
  }

  parseDocument(): Document | undefined {
    const heading = this.parse<MarkdownH1>('h1')?.content
    if (!heading) return undefined
    const article = this.parseArticle()
    const sections = this.parseSections()
    return { heading, article, sections }
  }

  parseSections(): Section[] {
    const section = this.parseSection()
    if (section) {
      return [section, ...this.parseSections()]
    }

    return []
  }

  parseSection(): Section | undefined {
    const heading = this.parse<MarkdownH2>('h2')?.content
    if (!heading) return undefined
    const article = this.parseArticle()
    const subsections = this.parseSubsections()
    return { heading, article, subsections }
  }

  parseSubsections(): Subsection[] {
    const subsection = this.parseSubsection()
    if (subsection) {
      return [subsection, ...this.parseSubsections()]
    }

    return []
  }

  parseSubsection(): Subsection | undefined {
    const heading = this.parse<MarkdownH3>('h3')?.content
    if (!heading) return undefined
    const article = this.parseArticle()
    return { heading, article }
  }

  parseArticle(): MarkdownItem[] {
    const item = this.parse('p') ?? this.parse('listItem')
    if (item) {
      return [item, ...this.parseArticle()]
    }

    return []
  }

  parse<K extends MarkdownItem>(type: K['type']): K | undefined {
    const item = this.markdown[this.index]
    if (item?.type !== type) {
      return undefined
    }

    this.index += 1
    return item as K
  }
}

function parseRelease(markdown: MarkdownItem[], section: Section): Release {
  const releaseHeading = section.heading.reduce((acc, part) => {
    switch (part.type) {
      case 'text':
        return acc + part.content
      case 'link':
        return acc + part.text
      default:
        return acc
    }
  }, '')

  const [, releaseName, releaseDate] = releaseHeading.match(/^(.*?)(?: - (\d{4}-\d{2}-\d{2}))?$/)!

  const release = new Release(releaseName)
  release.setDescription(itemsToString(section.article).trimEnd())
  if (releaseDate !== undefined) {
    release.setDate(releaseDate)
  }

  const link = section.heading.find((s): s is { type: 'link'; text: string; href?: string } => s.type === 'link')
  if (link !== undefined) {
    if (link.href) {
      const href = link.href
      release.setLink(href)
    } else {
      const ref = markdown.find((ref): ref is MarkdownReference => ref.type === 'reference' && ref.text === link.text)
      if (ref) {
        release.setLink(ref.href)
      }
    }
  }

  for (const subsection of section.subsections) {
    const category = contentToString(subsection.heading)
    const items = subsection.article
      .filter((s): s is MarkdownListItem => s.type === 'listItem')
      .map((s) => contentToString(s.content))

    for (const item of items) {
      release.addItem(category, item.trimEnd())
    }
  }

  return release
}

export function parseChangelog(changelogStr: string): Changelog {
  const changelog = new Changelog()
  const markdown = parseMarkdown(changelogStr)

  const parser = new Parser(markdown)
  const document = parser.parseDocument()

  if (document) {
    changelog.setHeading(contentToString(document.heading).trimEnd())
    changelog.setDescription(itemsToString(document.article).trimEnd())

    for (const section of document.sections) {
      const release = parseRelease(markdown, section)
      changelog.addRelease(release)
    }
  }

  return changelog
}
