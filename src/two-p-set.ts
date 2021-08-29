import { MD5 as hash } from "object-hash";

interface PSet<T> {
  [hash: string]: T;
}
interface TwoPSetInterface<T> {
  add(element: T): T;
}

class TwoPSet<T> implements TwoPSetInterface<T> {
  private _addSet: PSet<T>;
  private _removeSet: PSet<T>;

  constructor() {
    this._addSet = {};
    this._removeSet = {};
  }

  public add(element: T): T {
    const key = hash(element);
    this._addSet[key] = element;
    return this._addSet[key];
  }
}

export { TwoPSet };
