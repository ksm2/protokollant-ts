import { formatDate } from './formatDate'
import { Release } from './Release'

const UNRELEASED = 'Unreleased'

/**
 * Created on 2019-03-28.
 *
 * @author Konstantin Simon Maria Möllers
 */
export class Changelog {
  private _heading = 'Changelog'
  private _description = ''
  private _linkPrefix: string | null = null
  private _tagPrefix = ''
  private _unreleasedBranch: string | null = 'master'
  private readonly _releases: Release[] = []

  getHeading(): string {
    return this._heading
  }

  setHeading(value: string): this {
    this._heading = value
    return this
  }

  getDescription(): string {
    return this._description
  }

  setDescription(value: string): this {
    this._description = value
    return this
  }

  getLinkPrefix(): string | null {
    return this._linkPrefix
  }

  setLinkPrefix(value: string | null): this {
    this._linkPrefix = value
    return this
  }

  getTagPrefix(): string {
    return this._tagPrefix
  }

  setTagPrefix(value: string): this {
    this._tagPrefix = value
    return this
  }

  getUnreleasedBranch(): string | null {
    return this._unreleasedBranch
  }

  setUnreleasedBranch(value: string | null): this {
    this._unreleasedBranch = value
    return this
  }

  changed(item: string): this {
    this.getUnreleased().changed(item)
    return this
  }

  added(item: string): this {
    this.getUnreleased().added(item)
    return this
  }

  fixed(item: string): this {
    this.getUnreleased().fixed(item)
    return this
  }

  removed(item: string): this {
    this.getUnreleased().removed(item)
    return this
  }

  hasUnreleased(): boolean {
    return this._releases.some((release) => release.getName() === UNRELEASED)
  }

  getUnreleased(): Release {
    const release = this._releases.find((release) => release.getName() === UNRELEASED)
    if (!release) {
      const newRelease = new Release(UNRELEASED)
      if (this._linkPrefix && this._unreleasedBranch && this._releases.length > 0) {
        const latestReleaseName = this._releases[0].getName()
        newRelease.setLink(`${this._linkPrefix}${this._tagPrefix}${latestReleaseName}...${this._unreleasedBranch}`)
      }

      this._releases.unshift(newRelease)

      return newRelease
    }

    return release
  }

  getReleases(): IterableIterator<Release> {
    return this._releases[Symbol.iterator]()
  }

  addRelease(release: Release): this {
    this._releases.push(release)
    return this
  }

  removeRelease(release: Release): boolean {
    const index = this._releases.indexOf(release)
    const contained = index >= 0

    if (contained) {
      this._releases.splice(index, 1)
    }

    return contained
  }

  /**
   * Releases the latest unreleased changes.
   *
   * @param version - The version to release under.
   */
  release(version: string): this {
    if (!this.hasUnreleased()) {
      return this
    }

    const release = this.getUnreleased()
    release.setName(version)
    release.setDate(formatDate())

    if (this._linkPrefix && this._releases.length >= 2) {
      const latestReleaseName = this._releases[1].getName()
      release.setLink(`${this._linkPrefix}${this._tagPrefix}${latestReleaseName}...${this._tagPrefix}${version}`)
    }

    return this
  }
}
