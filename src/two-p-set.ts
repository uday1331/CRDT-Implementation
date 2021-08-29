interface PSet<T> {
  [hash: string]: T;
}
interface TwoPSetInterface<T> {
  add(element: T): T;
  remove(id: string): T;
  exists(id: string): boolean;
}

export interface TwoPSetElementInterface<T> {
  id: string;
  created: number;
  clone(): T;
  hash(): string;
}

export class TwoPSet<T extends TwoPSetElementInterface<T>>
  implements TwoPSetInterface<T>
{
  private _addSet: PSet<T>;
  private _removeSet: PSet<T>;

  constructor() {
    this._addSet = {};
    this._removeSet = {};
  }

  public add(element: T): T {
    const key = element.hash();
    if (this.exists(key)) {
      throw new Error(`Element with key: ${key} already exists.`);
    }

    this._addSet[key] = element;
    return this._addSet[key];
  }

  public remove(key: string): T {
    if (!this.exists(key)) {
      throw new Error(`Element with key: ${key} does not exist.`);
    }

    const inverse = this._addSet[key];

    this._removeSet[key] = inverse.clone();

    return this._removeSet[key];
  }

  public exists(key: string): boolean {
    if (
      !this._addSet[key] ||
      (this._removeSet[key] &&
        this._removeSet[key].created > this._addSet[key].created)
    ) {
      return false;
    }

    return true;
  }
}
