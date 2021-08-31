import { TwoPSetElement } from "./two-p-set-element";
import { TwoPSetElementInterface, TwoPSetInterface } from "./interface";

/**
 * Creates a 2P-Set with an add set and remove set
 * Generic passes to TwoPSet needs to implement type TwoPSetElementInterface as id
 * and time of creation are necessity in any basic 2P-Set.
 * The Sets for add and remove i.e _addSet and _removeSet are implemented as Maps
 * where the key needs to be defined according to the element that is passed in the class.
 * For a default implementation, look at TwoPSetElement.
 * @class
 */
export class TwoPSet<T extends TwoPSetElementInterface<T>>
  implements TwoPSetInterface<T>
{
  private _addSet: Map<string, T>;
  private _removeSet: Map<string, T>;

  constructor() {
    this._addSet = new Map();
    this._removeSet = new Map();
  }

  /**
   * Adds element to the 2P-Set.
   * @param {T} element Value to be added. Has same type constraints as generic for class.
   * @return {T} returns added element.
   */
  public add(element: T): T {
    const key = element.hash();
    if (this.exists(key)) {
      throw new Error(`Element with key: ${key} already exists.`);
    }

    this._addSet.set(key, element);
    return this._addSet.get(key);
  }

  /**
   * Removes element from the 2P-Set.
   * @param {T} element Value to be removed. Has same type constraints as generic for class.
   * @return {T} returns removed element.
   */
  public removeElement(element: T): T {
    const key = element.hash();
    if (!this.exists(key)) {
      throw new Error(`Element with key: ${key} does not exist.`);
    }

    this._removeSet.set(key, element);
    return this._removeSet.get(key);
  }

  /**
   * Remove element from the 2P-Set by uniquely defined hash.
   * @param {string} key Key i.e hash for the object that needs to be removed.
   * @return {T} The removed element
   */
  public remove(key: string): T {
    if (!this.exists(key)) {
      throw new Error(`Element with key: ${key} does not exist.`);
    }

    const inverse = this._addSet.get(key);

    this._removeSet.set(key, inverse.clone());

    return this._removeSet.get(key);
  }

  /**
   * Check if element exists in the 2p-Set
   * @param {string} key Key i.e hash for the object whose existence needs to be checked.
   * @return {boolean} Whether the object exists or not.
   */
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

  /**
   *
   * Get the effective adds i.e. given all states i.e. adds and removes, get all
   * add states where the element still exists in the 2P-Set.
   * @return {Array<T>} Array of effective adds.
   */
  public getEffectiveAdds(): Array<T> {
    return Array.from(this._addSet.values()).filter((value) =>
      this.exists(value.hash())
    );
  }

  /**
   * Get the effective removes i.e. given all states i.e. adds and removes, get all
   * add states where the element does not exist in the 2P-Set.
   * @return {Array<T>} Array of effective removes.
   */
  public getEffectiveRemoves(): Array<T> {
    return Array.from(this._removeSet.values()).filter(
      (value) => !this.exists(value.hash())
    );
  }

  /**
   * Simple function to union two arrays of the same side i.e. add or remove elements.
   * Useful in removing duplicates where the hash of two elements in different arrays might be
   * same.
   * eg: [2, 3, 4] and [3, 4, 1] results in [1, 2, 3, 4]. (The values in array represent hash values.)
   * @param {Array<T>} first Array with same type constraints as class to union.
   * @param {Array<T>} second Array with same type constraints as class to union.
   * @return {Array<T>} Union-ed Array
   */
  static unionArrays<T extends TwoPSetElementInterface<T>>(
    first: Array<T>,
    second: Array<T>
  ): Array<T> {
    const unionSet: Map<string, T> = new Map();

    first.forEach((element) => {
      const key = element.hash();
      if (!unionSet.has(key)) {
        unionSet.set(key, element);
      }
    });

    second.forEach((element) => {
      const key = element.hash();
      if (!unionSet.has(key)) {
        unionSet.set(key, element);
      }
    });

    return Array.from(unionSet.values());
  }

  /**
   * Merges two state-based 2P-Sets according to lastest creation time.
   * @param {Array<T>} first 2P-Set to be merged.
   * @param {Array<T>} second 2P-Set to be merged..
   * @return {Array<T>} Merged 2P-Set
   */
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

export { TwoPSetElement, TwoPSetElementInterface };
