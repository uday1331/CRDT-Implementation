import { TwoPSetElement } from "../element-node";
import { MD5 as md5Hash } from "object-hash";

export class CrdtElementGraphEdgeElement extends TwoPSetElement {
  private _edge: [string, string];

  constructor(u: string, v: string) {
    super();
    this._edge = u > v ? [u, v] : [v, u];
  }

  public get edge(): [string, string] {
    return this._edge;
  }

  public clone(): CrdtElementGraphEdgeElement {
    return new CrdtElementGraphEdgeElement(this._edge[0], this._edge[1]);
  }

  public hash(): string {
    return md5Hash(this._edge);
  }
}
