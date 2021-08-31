interface TwoPSetInterface<T> {
  add(element: T): T;
  remove(id: string): T;
  removeElement(element: T): T;
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

  public removeElement(element: T): T {
    const key = element.hash();
    if (!this.exists(key)) {
      throw new Error(`Element with key: ${key} does not exist.`);
    }

    this._removeSet.set(key, element);
    return this._removeSet.get(key);
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

  static unionArrays<T extends TwoPSetElementInterface<T>>(
    x: Array<T>,
    y: Array<T>
  ): Array<T> {
    const unionSet: Map<string, T> = new Map();

    x.forEach((element) => {
      const key = element.hash();
      if (!unionSet.has(key)) {
        unionSet.set(key, element);
      }
    });

    y.forEach((element) => {
      const key = element.hash();
      if (!unionSet.has(key)) {
        unionSet.set(key, element);
      }
    });

    return Array.from(unionSet.values());
  }

  static merge<T extends TwoPSetElementInterface<T>>(
    first: TwoPSet<T>,
    second: TwoPSet<T>
  ): TwoPSet<T> {
    const mergedSet: TwoPSet<T> = new TwoPSet();

    const unionAdds = this.unionArrays(
      first.getEffectiveAdds(),
      second.getEffectiveAdds()
    );

    const unionRemoves = this.unionArrays(
      first.getEffectiveRemoves(),
      second.getEffectiveRemoves()
    );

    unionAdds.forEach((element) => {
      mergedSet.add(element);
    });

    unionRemoves.forEach((element) => {
      mergedSet.removeElement(element);
    });

    return mergedSet;
  }
}
