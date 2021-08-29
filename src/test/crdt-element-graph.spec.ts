import { expect } from "chai";
import { CrdtElementGraph } from "../crdt-element-graph";

describe("CRDT Element Graph Tests", () => {
  let crdtElementGraph: CrdtElementGraph;

  beforeEach(() => {
    crdtElementGraph = new CrdtElementGraph();
  });

  describe("Add Vertex", () => {
    it("adds vertex to Graph", () => {
      const res = crdtElementGraph.addVertex("vertex-one");

      expect(res.vertex).to.be.equal("vertex-one");
    });

    it("errors when trying add vertex to Graph if exists", () => {
      crdtElementGraph.addVertex("vertex-one");
      const res = () => crdtElementGraph.addVertex("vertex-one");

      expect(res).to.throw("Error adding vertex.");
    });
  });

  describe("Exists Vertex", () => {
    it("check vertex exists in Graph", () => {
      crdtElementGraph.addVertex("vertex-one");
      const res = crdtElementGraph.existsVertex("vertex-one");

      expect(res).to.be.true;
    });
  });

  describe("Remove Vertex", () => {
    it("remove vertex from Graph with no edge", async () => {
      const original = crdtElementGraph.addVertex("vertex-one");
      const res = crdtElementGraph.removeVertex("vertex-one");

      expect(res.vertex).to.be.equal(original.vertex);
    });

    // it("errors when trying to remove vertex with edges", () => {
    //   const res = () => crdtElementGraph.removeVertex("element-one");

    //   expect(res).to.throw(`Element with id: element-one does not exist.`);
    // });
  });
});
