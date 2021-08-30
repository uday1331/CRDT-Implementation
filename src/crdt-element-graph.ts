import { TwoPSetElement } from "./element-node";
import { TwoPSet } from "./two-p-set";
import { MD5 as md5Hash } from "object-hash";

interface CrdtElementGraphInterface {
  addVertex(id: string): TwoPSetElement;
  removeVertex(id: string): TwoPSetElement;
  existsVertex(id: string): boolean;
  addEdge(u: string, v: string): TwoPSetElement;
  removeEdge(u: string, v: string): TwoPSetElement;
  getConnectedVertices(id: string): Array<TwoPSetElement>;
  findPath(u: string, v: string): Array<string>;
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
    try {
      return this._vertexSet.remove(clone.hash());
    } catch (e) {
      throw new Error("Error removing vertex.");
    }
  }

  public existsVertex(id: string): boolean {
    const clone = new CrdtElementGraphVertexElement(id);
    return this._vertexSet.exists(clone.hash());
  }

  public getConnectedVertices(
    id: string
  ): Array<CrdtElementGraphVertexElement> {
    if (!this.existsVertex(id)) {
      throw new Error("Given Vertex does not exist.");
    }

    const effectiveAddEdges = this._edgeSet.getEffectiveAdds();
    return effectiveAddEdges
      .map(({ edge }) => {
        if (edge[0] == id) {
          return new CrdtElementGraphVertexElement(edge[1]);
        }

        if (edge[1] == id) {
          return new CrdtElementGraphVertexElement(edge[0]);
        }

        return null;
      })
      .filter((element) => element != null);
  }

  public addEdge(u: string, v: string): CrdtElementGraphEdgeElement {
    if (!this.existsVertex(u) || !this.existsVertex(v)) {
      throw new Error("One or both vertices do not exist.");
    }

    return this._edgeSet.add(new CrdtElementGraphEdgeElement(u, v));
  }

  public removeEdge(u: string, v: string): CrdtElementGraphEdgeElement {
    if (!this.existsVertex(u) || !this.existsVertex(v)) {
      throw new Error("One or both vertices do not exist.");
    }
    const clone = new CrdtElementGraphEdgeElement(u, v);

    return this._edgeSet.remove(clone.hash());
  }

  public existsEdge(u: string, v: string): boolean {
    const clone = new CrdtElementGraphEdgeElement(u, v);
    return this._edgeSet.exists(clone.hash());
  }

  public findPath(u: string, v: string): Array<string> {
    const discovered: Set<string> = new Set();
    const stack: Array<string> = [];
    const path: Array<string> = [];

    stack.push(u);

    while (stack.length != 0) {
      const current = stack.pop();
      path.push(current);
      discovered.add(current);

      if (current === v) {
        return path;
      }

      let added = false;
      for (const { vertex } of this.getConnectedVertices(current)) {
        if (!discovered.has(vertex)) {
          added = true;
          stack.push(vertex);
        }
      }

      if (!added) {
        path.pop();
      }
    }

    return [];
  }

  // static merge(
  //   first: CrdtElementGraph,
  //   second: CrdtElementGraph
  // ): CrdtElementGraph {
  //   return first;
  // }
}

export { CrdtElementGraph };
