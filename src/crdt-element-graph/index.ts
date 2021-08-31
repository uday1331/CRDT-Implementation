import { TwoPSet } from "../two-p-set";
import { CrdtElementGraphVertexElement } from "./vertex-element";
import { CrdtElementGraphEdgeElement } from "./edge-element";
import { CrdtElementGraphInterface } from "./interface";

class CrdtElementGraph implements CrdtElementGraphInterface {
  private _vertexSet: TwoPSet<CrdtElementGraphVertexElement>;
  private _edgeSet: TwoPSet<CrdtElementGraphEdgeElement>;

  constructor() {
    this._vertexSet = new TwoPSet();
    this._edgeSet = new TwoPSet();
  }

  public get vertices(): Array<CrdtElementGraphVertexElement> {
    return Array.from(this._vertexSet.getEffectiveAdds());
  }

  public get edges(): Array<CrdtElementGraphEdgeElement> {
    return Array.from(this._edgeSet.getEffectiveAdds());
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

    if (u === v) {
      throw new Error(
        "Cannot created edges to the same vertex. Vertices need to be mutually distinct."
      );
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
    if (!this.existsVertex(u) || !this.existsVertex(v)) {
      throw new Error("One or both vertices do not exist.");
    }

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

  static merge(
    first: CrdtElementGraph,
    second: CrdtElementGraph
  ): CrdtElementGraph {
    const mergedCrdtElementGraph = new CrdtElementGraph();

    mergedCrdtElementGraph._vertexSet = TwoPSet.merge(
      first._vertexSet,
      second._vertexSet
    );
    mergedCrdtElementGraph._edgeSet = TwoPSet.merge(
      first._edgeSet,
      second._edgeSet
    );

    return mergedCrdtElementGraph;
  }
}

export { CrdtElementGraph };
