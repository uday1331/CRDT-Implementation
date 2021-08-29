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
    it("remove vertex from Graph with no edge", () => {
      const original = crdtElementGraph.addVertex("vertex-one");
      const res = crdtElementGraph.removeVertex("vertex-one");

      expect(res.vertex).to.be.equal(original.vertex);
    });

    it("errors when trying to remove non existent vertex", () => {
      crdtElementGraph.addVertex("vertex-one");
      crdtElementGraph.removeVertex("vertex-one");
      const res = () => crdtElementGraph.removeVertex("vertex-one");

      expect(res).to.throw("Error removing vertex.");
    });

    it("errors when trying to remove vertex with edges", () => {
      crdtElementGraph.addVertex("vertex-one");
      crdtElementGraph.addVertex("vertex-two");
      crdtElementGraph.addEdge("vertex-one", "vertex-two");

      crdtElementGraph.removeVertex("vertex-two");
    });
  });

  describe("Add Edge", () => {
    it("add edge for existing vertices", () => {
      crdtElementGraph.addVertex("vertex-one");
      crdtElementGraph.addVertex("vertex-two");

      const res = crdtElementGraph.addEdge("vertex-one", "vertex-two");
      expect(res.edge).to.have.members(["vertex-one", "vertex-two"]);
    });

    it("errors when trying to add edge for non existent vertices", async () => {
      crdtElementGraph.addVertex("vertex-one");

      const res = () => crdtElementGraph.addEdge("vertex-one", "vertex-two");
      expect(res).to.throw("One or both vertices do not exist.");
    });
  });

  describe("Remove Edge", () => {
    it("remove edge for existing edge", async () => {
      crdtElementGraph.addVertex("vertex-one");
      crdtElementGraph.addVertex("vertex-two");
      crdtElementGraph.addEdge("vertex-one", "vertex-two");

      const res = crdtElementGraph.removeEdge("vertex-one", "vertex-two");
      expect(res.edge).to.have.members(["vertex-one", "vertex-two"]);
    });
  });

  describe("Exists Edge", () => {
    it("remove edge for existing edge", async () => {
      crdtElementGraph.addVertex("vertex-one");
      crdtElementGraph.addVertex("vertex-two");
      crdtElementGraph.addEdge("vertex-one", "vertex-two");

      const res = crdtElementGraph.existsEdge("vertex-one", "vertex-two");
      expect(res).to.be.true;
    });
  });
});
