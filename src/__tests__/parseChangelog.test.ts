import { Changelog } from '../Changelog'
import { parseChangelog } from '../parseChangelog'

describe('parseChangelog', () => {
  it('parses an empty string', () => {
    const changelog = new Changelog()
    expect(parseChangelog('')).toStrictEqual(changelog)
  })

  it('parses heading', () => {
    const changelog = new Changelog()
    changelog.setHeading('Keep a Changelog')
    expect(parseChangelog('# Keep a Changelog')).toStrictEqual(changelog)
  })

  it('parses description', () => {
    const changelog = new Changelog()
    const description = `\
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).`

    changelog.setHeading('Changelog')
    changelog.setDescription(description)
    expect(
      parseChangelog(`\
# Changelog
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
`)
    ).toStrictEqual(changelog)
  })

  it('parses a full changelog', () => {
    const description = `\
All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).`

    const changelog = parseChangelog(`\
# Changelog
${description}

## [Unreleased] - 2021-01-24
### Changed
- Upgrade dependencies
- Change project configuration


[Unreleased]: https://github.com/ksm2/protokollant/compare/v1.0.2...master
`)
    expect(changelog.getHeading()).toBe('Changelog')
    expect(changelog.getDescription()).toBe(description)

    const releases = changelog.getReleases()
    expect(releases).toHaveLength(1)
    const release = releases[0]
    expect(release.getName()).toBe('Unreleased')
    expect(release.getLink()).toBe('https://github.com/ksm2/protokollant/compare/v1.0.2...master')
    expect(release.getDate()).toBe('2021-01-24')

    expect(release.getItems().size).toBe(1)
    const [[category, items]] = Array.from(release.getItems())
    expect(category).toBe('changed')
    expect(items).toHaveLength(2)

    const [item0, item1] = items
    expect(item0).toBe('Upgrade dependencies')
    expect(item1).toBe('Change project configuration')
  })

  it('parses a changelog with a described release', () => {
    const description = `\
This is the **initial** release!
Hope you like it!`

    const changelog = parseChangelog(`\
# Changelog
## [Unreleased] - 2021-01-24
${description}

### Added
- Feature 1
- Feature 2


[Unreleased]: https://github.com/ksm2/protokollant/compare/v1.0.2...master
`)
    expect(changelog.getHeading()).toBe('Changelog')
    expect(changelog.getDescription()).toBe('')

    const releases = changelog.getReleases()
    expect(releases).toHaveLength(1)
    const release = releases[0]
    expect(release.getName()).toBe('Unreleased')
    expect(release.getDescription()).toBe(description)
  })
})
