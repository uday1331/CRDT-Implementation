import { TwoPSet } from "../two-p-set";
import { CrdtElementGraphVertexElement } from "./vertex-element";
import { CrdtElementGraphEdgeElement } from "./edge-element";
import { CrdtElementGraphInterface } from "./interface";

/**
 * Creates a CrdtElementGraph with an edge TwoPSet and vertex TwoPSet.
 * @class
 */

class CrdtElementGraph implements CrdtElementGraphInterface {
  private _vertexSet: TwoPSet<CrdtElementGraphVertexElement>;
  private _edgeSet: TwoPSet<CrdtElementGraphEdgeElement>;

  constructor() {
    this._vertexSet = new TwoPSet();
    this._edgeSet = new TwoPSet();
  }

  /**
   * Get all Vertices in the Graph after all add and remove
   * @return {Array<CrdtElementGraphVertexElement>} List of vertices
   */
  public get vertices(): Array<CrdtElementGraphVertexElement> {
    return Array.from(this._vertexSet.getEffectiveAdds());
  }

  /**
   * Get all Edges in the Graph after all add and remove
   * @return {Array<CrdtElementGraphEdgeElement>} List of edges
   */
  public get edges(): Array<CrdtElementGraphEdgeElement> {
    return Array.from(this._edgeSet.getEffectiveAdds());
  }

  /**
   * Add a new vertex to the vertex TwoPSet using the vertex id
   * @param {string} id ID/Name of the vertex to be added. Needs to be unique.
   * @return {CrdtElementGraphVertexElement} The added vertex
   */
  public addVertex(id: string): CrdtElementGraphVertexElement {
    try {
      return this._vertexSet.add(new CrdtElementGraphVertexElement(id));
    } catch (e) {
      throw new Error("Error adding vertex.");
    }
  }

  /**
   * Remove a vertex from the vertex TwoPSet using the vertex id
   * @param {string} id ID/Name of the vertex to be removed.
   * @return {CrdtElementGraphVertexElement} The removed vertex
   */
  public removeVertex(id: string): CrdtElementGraphVertexElement {
    const clone = new CrdtElementGraphVertexElement(id);
    try {
      return this._vertexSet.remove(clone.hash());
    } catch (e) {
      throw new Error("Error removing vertex.");
    }
  }

  /**
   * Checks whether vertex exists by id
   * @param {string} id ID/Name of the vertex to be checked.
   * @return {CrdtElementGraphVertexElement} Whether the vertex exists or not.
   */
  public existsVertex(id: string): boolean {
    const clone = new CrdtElementGraphVertexElement(id);
    return this._vertexSet.exists(clone.hash());
  }

  /**
   * Get list of vertices connected to the vertex with provided ID.
   * @param {string} id ID/Name of the vertex to be queried.
   * @return {Array<CrdtElementGraphVertexElement>} List of connected vertices.
   */

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

  /**
   * Add a new edge to the edge TwoPSet using the vertex ids for the edge.
   * @param {string} u ID/Name of the first vertex the edge connects.
   * @param {string} v ID/Name of the second vertex the edge connects.
   * @return {CrdtElementGraphEdgeElement} The added edge.
   */
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

  /**
   * Remove an edge from the edge TwoPSet using the vertex ids for the edge.
   * @param {string} u ID/Name of the first vertex the edge connects.
   * @param {string} v ID/Name of the second vertex the edge connects.
   * @return {CrdtElementGraphEdgeElement} The removed edge.
   */
  public removeEdge(u: string, v: string): CrdtElementGraphEdgeElement {
    if (!this.existsVertex(u) || !this.existsVertex(v)) {
      throw new Error("One or both vertices do not exist.");
    }
    const clone = new CrdtElementGraphEdgeElement(u, v);

    return this._edgeSet.remove(clone.hash());
  }

  /**
   * Check if the edge exists in the edge TwoPSet using the vertex ids for the edge.
   * @param {string} u ID/Name of the first vertex the edge connects.
   * @param {string} v ID/Name of the second vertex the edge connects.
   * @return {CrdtElementGraphEdgeElement} Whether the edge exists or not.
   */
  public existsEdge(u: string, v: string): boolean {
    const clone = new CrdtElementGraphEdgeElement(u, v);
    return this._edgeSet.exists(clone.hash());
  }

  /**
   * Return a path between given vertices.
   * @param {string} u ID/Name of the first vertex.
   * @param {string} v ID/Name of the second vertex.
   * @return {Array<string>} The path as an ordered list of ID/Name of vertices.
   * Returns [] for no path.
   */
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

  /**
   * Merges two state-based CrdtElementGraphs according to lastest creation time. Uses underlying
   * methods in TwoPSet to merge vertex and edge sets.
   * @param {Array<T>} first CrdtElementGraph to be merged.
   * @param {Array<T>} second CrdtElementGraphsto be merged.
   * @return {Array<T>} Merged CrdtElementGraphs
   */
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
