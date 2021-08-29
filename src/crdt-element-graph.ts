import { TwoPSetElement } from "./element-node";
import { TwoPSet } from "./two-p-set";
import { MD5 as md5Hash } from "object-hash";

interface CrdtElementGraphInterface {
  addVertex(id: string): TwoPSetElement;
  removeVertex(id: string): TwoPSetElement;
  existsVertex(id: string): boolean;
  addEdge(u: string, v: string): TwoPSetElement;
}

class CrdtElementGraphVertexElement extends TwoPSetElement {
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

class CrdtElementGraphEdgeElement extends TwoPSetElement {
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

class CrdtElementGraph implements CrdtElementGraphInterface {
  private _vertexSet: TwoPSet<CrdtElementGraphVertexElement>;
  private _edgeSet: TwoPSet<CrdtElementGraphEdgeElement>;

  constructor() {
    this._vertexSet = new TwoPSet();
    this._edgeSet = new TwoPSet();
  }

  public addVertex(id: string): CrdtElementGraphVertexElement {
    try {
      return this._vertexSet.add(new CrdtElementGraphVertexElement(id));
    } catch (e) {
      throw new Error("Error adding vertex.");
    }
  }

  public removeVertex(id: string): CrdtElementGraphVertexElement {
    const clone = new CrdtElementGraphVertexElement(id);
    return this._vertexSet.remove(clone.hash());
  }

  public existsVertex(id: string): boolean {
    const clone = new CrdtElementGraphVertexElement(id);
    return this._vertexSet.exists(clone.hash());
  }

  public addEdge(u: string, v: string): CrdtElementGraphEdgeElement {
    if (!this.existsVertex(u) || !this.existsVertex(v)) {
      throw new Error("One or both vertices do not exist.");
    }

    return this._edgeSet.add(new CrdtElementGraphEdgeElement(u, v));
  }
}

export { CrdtElementGraph };
