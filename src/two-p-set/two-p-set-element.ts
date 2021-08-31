import { v4 as uuid } from "uuid";
import { MD5 as md5Hash } from "object-hash";
import { TwoPSetElementInterface } from ".";

export class TwoPSetElement implements TwoPSetElementInterface<TwoPSetElement> {
  private _created: number;
  private _id: string;

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

  public clone(): TwoPSetElement {
    return new TwoPSetElement(this._id, Date.now());
  }

  public hash(): string {
    return md5Hash(this._id);
  }
}
