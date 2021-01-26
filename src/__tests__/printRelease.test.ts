import { printRelease } from '../printRelease'
import { Release } from '../Release'

describe('printRelease', () => {
  it('prints empty release', () => {
    const release = new Release('1.2.3')
    expect(printRelease(release)).toBe('## 1.2.3\n')
  })

  it('prints release with description', () => {
    const release = new Release('0.0.0')
    const description = 'Lorem Ipsum\ndolor sit amet.'
    release.setDescription(description)
    expect(printRelease(release)).toBe(`## 0.0.0\n${description}\n`)
  })

  it('prints release with all types', () => {
    const release = new Release('Unreleased')
    release.setDescription('Lorem Ipsum')
    release.changed('changed')
    release.added('added')
    release.fixed('fixed')
    release.removed('removed')
    release.addItem('x', 'x')
    release.addItem('b', 'b')
    expect(printRelease(release)).toBe(`\
## Unreleased
Lorem Ipsum

### Added
- added
### B
- b
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
    const release = new Release('Bar')
    release.setLink('https://bar')
    release.setDate('2021-01-24')

    expect(printRelease(release)).toBe(`\
## [Bar] - 2021-01-24


[Bar]: https://bar
`)
  })
})
