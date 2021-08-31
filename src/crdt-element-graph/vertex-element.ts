import { TwoPSetElement } from "../two-p-set";
import { MD5 as md5Hash } from "object-hash";

export class CrdtElementGraphVertexElement extends TwoPSetElement {
  private _vertex: string;

  constructor(vertex: string) {
    super();
    this._vertex = vertex;
  }

  public get vertex(): string {
    return this._vertex;
  }

  public clone(): CrdtElementGraphVertexElement {
    return new CrdtElementGraphVertexElement(this._vertex);
  }

  public hash(): string {
    return md5Hash(this._vertex);
  }
}
