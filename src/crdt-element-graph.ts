import { ElementNode } from "./element-node";
import { TwoPSet } from "./two-p-set";

interface CrdtElementGraphInterface {
  addVertex(id: string, created?: number): ElementNode;
}

class CrdtElementGraph implements CrdtElementGraphInterface {
  private _vertexSet: TwoPSet<ElementNode>;
  private _edgeSet: TwoPSet<ElementNode>;

  constructor() {
    this._vertexSet = new TwoPSet();
    this._edgeSet = new TwoPSet();
  }

  public addVertex(id: string, created?: number): ElementNode {
    return this._vertexSet.add(new ElementNode(id, created));
  }
}

export { CrdtElementGraph };
