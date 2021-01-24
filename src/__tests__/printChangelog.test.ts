import { Changelog } from '../Changelog'
import { printChangelog } from '../printChangelog'
import { Release } from '../Release'

describe('printChangelog', () => {
  it('prints empty changelog', () => {
    const changelog = new Changelog()
    expect(printChangelog(changelog)).toBe('# Changelog\n')
  })

  it('prints changelog with description', () => {
    const changelog = new Changelog()
    changelog.setDescription('Lorem Ipsum\ndolor sit amet.')
    expect(printChangelog(changelog)).toBe('# Changelog\nLorem Ipsum\ndolor sit amet.\n')
  })

  it('prints changelog with all types', () => {
    const changelog = new Changelog()
    changelog.setDescription('Lorem Ipsum\n\n')
    changelog.added('added')
    changelog.changed('changed')
    changelog.fixed('fixed')
    changelog.removed('removed')
    changelog.addItem('x', 'x')
    expect(printChangelog(changelog)).toBe(`\
# Changelog
Lorem Ipsum

## Unreleased
### Added
- added
### Changed
- changed
### Fixed
- fixed
### Removed
- removed
### X
- x
`)
  })

  it('prints changelog with linked releases', () => {
    const changelog = new Changelog()

    const release1 = new Release('Foo')
    release1.setLink('https://foo')
    changelog.addRelease(release1)

    const release2 = new Release('Bar')
    release2.setLink('https://bar')
    release2.setDate('2021-01-24')
    changelog.addRelease(release2)

    expect(printChangelog(changelog)).toBe(`\
# Changelog

## [Foo]

## [Bar] - 2021-01-24


[Foo]: https://foo
[Bar]: https://bar
`)
  })
})
