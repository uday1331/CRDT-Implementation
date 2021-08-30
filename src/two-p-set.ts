interface TwoPSetInterface<T> {
  add(element: T): T;
  remove(id: string): T;
  exists(id: string): boolean;
  getEffectiveAdds(): Array<T>;
  getEffectiveRemoves(): Array<T>;
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
  private _addSet: Map<string, T>;
  private _removeSet: Map<string, T>;

  constructor() {
    this._addSet = new Map();
    this._removeSet = new Map();
  }

  public add(element: T): T {
    const key = element.hash();
    if (this.exists(key)) {
      throw new Error(`Element with key: ${key} already exists.`);
    }

    this._addSet.set(key, element);
    return this._addSet.get(key);
  }

  public remove(key: string): T {
    if (!this.exists(key)) {
      throw new Error(`Element with key: ${key} does not exist.`);
    }

    const inverse = this._addSet.get(key);

    this._removeSet.set(key, inverse.clone());

    return this._removeSet.get(key);
  }

  public exists(key: string): boolean {
    if (
      !this._addSet.get(key) ||
      (this._removeSet.get(key) &&
        this._removeSet.get(key).created >= this._addSet.get(key).created)
    ) {
      return false;
    }

    return true;
  }

  public getEffectiveAdds(): Array<T> {
    return Array.from(this._addSet.values()).filter((value) =>
      this.exists(value.hash())
    );
  }

  public getEffectiveRemoves(): Array<T> {
    return Array.from(this._removeSet.values()).filter(
      (value) => !this.exists(value.hash())
    );
  }
}
