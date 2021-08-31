import { v4 as uuid } from "uuid";
import { MD5 as md5Hash } from "object-hash";
import { TwoPSetElementInterface } from ".";

/**
 * Implements TwoPSetElementInterface.
 * Element to the TwoPSet Set. As required by the interface, implements a basic hash method
 * which is used inside TwoPSet.Can be used as is in the TwoPSet class.
 * Examples are in the tests for the class.
 * For your own implementation, you can choose to either extends this class or implement
 * TwoPSetElementInterface.
 * @class
 */

export class TwoPSetElement implements TwoPSetElementInterface<TwoPSetElement> {
  private _created: number;
  private _id: string;

  /**
   * @param {string} id - Id for the element to be added to the class.
   * Also used in the hashing function.
   * @param {number} created -  Timestamp for when the value is created.
   */
  constructor(id: string = uuid(), created: number = Date.now()) {
    this._created = created;
    this._id = id;
  }

  public get id(): string {
    return this._id;
  }

  public get created(): number {
    return this._created;
  }

  /**
   * Clones the current object and returns with a new timestamp.
   * @returns {TwoPSetElement} A Clone of the current object.
   */
  public clone(): TwoPSetElement {
    return new TwoPSetElement(this._id, Date.now());
  }

  /**
   * Creates a hash for the current object. Not recommended to use created field for the current
   * TwoPSet implementation.
   * @returns {string} Hash value for the current object.
   */
  public hash(): string {
    return md5Hash(this._id);
  }
}
