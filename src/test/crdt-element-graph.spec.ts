import { expect } from "chai";
import { CrdtElementGraph } from "../crdt-element-graph";
import { ElementNode } from "../element-node";

describe("CRDT Element Graph Tests", () => {
  let crdtElementGraph: CrdtElementGraph;

  beforeEach(() => {
    crdtElementGraph = new CrdtElementGraph();
  });

  it("adds vertex to Graph", () => {
    const res = crdtElementGraph.addVertex("vertex-one", 1);
    const expected = new ElementNode("vertex-one", 1);

    expect(res.created).to.be.equal(expected.created);
    expect(res.id).to.be.equal(expected.id);
  });
});
