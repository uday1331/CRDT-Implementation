import { TwoPSetElement } from "../two-p-set";
import { MD5 as md5Hash } from "object-hash";

/**
 * Extends TwoPSetElement.
 * Implements a CRDT Element Graph Vertex as a TwoPSetElement, overriding some crucial methods.
 * @class
 */
export class CrdtElementGraphVertexElement extends TwoPSetElement {
  private _vertex: string;

  /**
   * @param {string} vertex ID/Name of the first vertex the edge connects.
   */
  constructor(vertex: string) {
    super();
    this._vertex = vertex;
  }

  /**
   * Getter for the edge vertices.
   * @returns {string} - The vertex.
   */
  public get vertex(): string {
    return this._vertex;
  }

  /**
   * Overrides TwoPSetElement.clone.
   * @override
   * @return {CrdtElementGraphVertexElement} The vertex clone.
   */
  public clone(): CrdtElementGraphVertexElement {
    return new CrdtElementGraphVertexElement(this._vertex);
  }

  /**
   * Overrides TwoPSet.hash
   * @override
   * @returns {string} Hash value for the current object.
   */
  public hash(): string {
    return md5Hash(this._vertex);
  }
}
