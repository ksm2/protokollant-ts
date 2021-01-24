import { Changelog } from '../Changelog'
import { formatDate } from '../formatDate'
import { Release } from '../Release'

describe('Changelog', () => {
  let changelog: Changelog

  beforeEach(() => {
    changelog = new Changelog()
  })

  it('represents a changelog', () => {
    expect(changelog.getHeading()).toBe('Changelog')
    changelog.setHeading('Other')
    expect(changelog.getHeading()).toBe('Other')

    expect(changelog.getDescription()).toBe('')
    changelog.setDescription('Lorem Ipsum')
    expect(changelog.getDescription()).toBe('Lorem Ipsum')

    expect(changelog.getTagPrefix()).toBe('')
    changelog.setTagPrefix('v')
    expect(changelog.getTagPrefix()).toBe('v')

    expect(changelog.getLinkPrefix()).toBe(null)
    changelog.setLinkPrefix('https://foo/')
    expect(changelog.getLinkPrefix()).toBe('https://foo/')
  })

  it('has releases', () => {
    expect(changelog.getReleases()).toHaveLength(0)

    const release = new Release('Hello World')
    changelog.addRelease(release)
    expect(changelog.getReleases()).toHaveLength(1)
    expect(changelog.getReleases()).toHaveProperty('0', release)

    let result = changelog.removeRelease(release)
    expect(result).toBe(true)
    expect(changelog.getReleases()).toHaveLength(0)

    result = changelog.removeRelease(release)
    expect(result).toBe(false)
  })

  it('has unreleased release', () => {
    expect(changelog.getReleases()).toHaveLength(0)

    const release = new Release('Unreleased')
    expect(changelog.hasUnreleased()).toBe(false)
    changelog.addRelease(release)
    expect(changelog.hasUnreleased()).toBe(true)
    expect(changelog.getUnreleased()).toBe(release)
    expect(changelog.getReleases()).toHaveLength(1)
  })

  it('adds unreleased release if it does not exist', () => {
    expect(changelog.getReleases()).toHaveLength(0)

    expect(changelog.hasUnreleased()).toBe(false)
    const release = changelog.getUnreleased()
    expect(changelog.hasUnreleased()).toBe(true)
    expect(changelog.getReleases()).toHaveLength(1)
    expect(release.getName()).toBe('Unreleased')
  })

  it('releases', () => {
    const release1 = new Release('Unreleased')
    release1.fixed('Fix some bug')

    const release2 = new Release('1.0.0')
    release2.setDate('2021-01-24')

    changelog.addRelease(release1)
    changelog.addRelease(release2)

    expect(changelog.hasUnreleased()).toBe(true)
    expect(changelog.getReleases()).toHaveLength(2)

    changelog.release('1.1.0')
    expect(changelog.hasUnreleased()).toBe(false)
    expect(changelog.getReleases()).toHaveLength(2)
    expect(changelog.getReleases()[0]).toBe(release1)
    expect(release1.getName()).toBe('1.1.0')
    expect(release1.getDate()).toBe(formatDate(new Date()))

    changelog.release('1.2.0')
    expect(changelog.getReleases()).toHaveLength(2)
    expect(release1.getName()).toBe('1.1.0')
  })
})
