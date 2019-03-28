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

  getUnreleased(): Release {
    const release = this._releases.find(release => release.getName() === UNRELEASED)
    if (!release) {
      const newRelease = new Release(UNRELEASED)
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
}
