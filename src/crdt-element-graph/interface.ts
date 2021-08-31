import { TwoPSetElement } from "../two-p-set";
import { CrdtElementGraphEdgeElement } from "./edge-element";
import { CrdtElementGraphVertexElement } from "./vertex-element";

export interface CrdtElementGraphInterface {
  vertices: Array<CrdtElementGraphVertexElement>;
  edges: Array<CrdtElementGraphEdgeElement>;
  addVertex(id: string): TwoPSetElement;
  removeVertex(id: string): TwoPSetElement;
  existsVertex(id: string): boolean;
  addEdge(u: string, v: string): TwoPSetElement;
  removeEdge(u: string, v: string): TwoPSetElement;
  getConnectedVertices(id: string): Array<TwoPSetElement>;
  findPath(u: string, v: string): Array<string>;
}
