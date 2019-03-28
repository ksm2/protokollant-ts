/**
 * Created on 2019-03-28.
 *
 * @author Konstantin Simon Maria Möllers
 */
export class Release {
  [key: string]: any

  private readonly _name: string
  private _link: string | null = null
  private _date: string | null = null
  private readonly _items = new Map<string, string[]>()

  constructor(name: string) {
    this._name = name
  }

  getName(): string {
    return this._name
  }

  getLink(): string | null {
    return this._link
  }

  setLink(value: string | null): this {
    this._link = value
    return this
  }

  getDate(): string | null {
    return this._date
  }

  setDate(value: string | null): this {
    this._date = value
    return this
  }

  getItems(): Map<string, string[]> {
    return this._items
  }

  changed(item: string): this {
    return this.addToCategory('changed', item)
  }

  added(item: string): this {
    return this.addToCategory('added', item)
  }

  fixed(item: string): this {
    return this.addToCategory('fixed', item)
  }

  removed(item: string): this {
    return this.addToCategory('removed', item)
  }

  private addToCategory(category: string, item: string): this {
    let ary = this._items.get(category) || []
    this._items.set(category, ary)
    ary.push(item)

    return this
  }
}
