import { TwoPSetElement } from "../two-p-set";
import { MD5 as md5Hash } from "object-hash";

/**
 * Extends TwoPSetElement.
 * Implements a CRDT Element Graph Edge as a TwoPSetElement, overriding some crucial methods.
 * @class
 */
export class CrdtElementGraphEdgeElement extends TwoPSetElement {
  private _edge: [string, string];

  /**
   * The constructor ensures an order in the vertex naming for the edge to resolve duplicates.
   * Thus, given the undirected nature of the graph, ["A", "B"] and ["B", "A"] both get stored as
   * ["B", "A"]. It helps the hashing function realise they are the same edge.
   * @param {string} u ID/Name of the first vertex the edge connects.
   * @param {string} v ID/Name of the second vertex the edge connects.
   */
  constructor(u: string, v: string) {
    super();
    this._edge = u > v ? [u, v] : [v, u];
  }

  /**
   * Getter for the edge vertices.
   * @returns {[string, string]} The vertex pair comprising the edge.
   */
  public get edge(): [string, string] {
    return this._edge;
  }

  /**
   * Overrides TwoPSetElement.clone.
   * @override
   * @return {CrdtElementGraphEdgeElement} The vertex pair comprising the edge.
   */
  public clone(): CrdtElementGraphEdgeElement {
    return new CrdtElementGraphEdgeElement(this._edge[0], this._edge[1]);
  }

  /**
   * Overrides TwoPSet.hash
   * @override
   * @returns {string} Hash value for the current object.
   */
  public hash(): string {
    return md5Hash(this._edge);
  }
}
