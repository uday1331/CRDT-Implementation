import { expect } from "chai";
import { CrdtElementGraph } from "../crdt-element-graph";
import { delay } from "./utils";

describe("CRDT Element Graph Tests", () => {
  let crdtElementGraph: CrdtElementGraph;

  beforeEach(() => {
    crdtElementGraph = new CrdtElementGraph();
  });

  describe("Add Vertex", () => {
    it("adds vertex to Graph", () => {
      const res = crdtElementGraph.addVertex("vertex-one");

      expect(res.vertex).to.be.eql("vertex-one");
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

      expect(res.vertex).to.be.eql(original.vertex);
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
      expect(res.edge).to.eql(["vertex-two", "vertex-one"]);
    });

    it("errors when trying to add edge for non existent vertices", async () => {
      crdtElementGraph.addVertex("vertex-one");

      const res = () => crdtElementGraph.addEdge("vertex-one", "vertex-two");
      expect(res).to.throw("One or both vertices do not exist.");
    });

    it("errors when trying to add edge for same vertex", async () => {
      crdtElementGraph.addVertex("vertex-one");

      const res = () => crdtElementGraph.addEdge("vertex-one", "vertex-one");
      expect(res).to.throw(
        "Cannot created edges to the same vertex. Vertices need to be mutually distinct."
      );
    });
  });

  describe("Remove Edge", () => {
    it("remove edge for existing edge", async () => {
      crdtElementGraph.addVertex("vertex-one");
      crdtElementGraph.addVertex("vertex-two");
      crdtElementGraph.addEdge("vertex-one", "vertex-two");

      const res = crdtElementGraph.removeEdge("vertex-one", "vertex-two");
      expect(res.edge).to.eql(["vertex-two", "vertex-one"]);
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

  describe("Connected Edges", () => {
    it("get connected vertices for vertices of edge", async () => {
      crdtElementGraph.addVertex("vertex-one");
      crdtElementGraph.addVertex("vertex-two");
      crdtElementGraph.addVertex("vertex-three");

      crdtElementGraph.addEdge("vertex-one", "vertex-two");
      crdtElementGraph.addEdge("vertex-two", "vertex-three");
      crdtElementGraph.addEdge("vertex-three", "vertex-one");

      const resOne = crdtElementGraph.getConnectedVertices("vertex-one");
      const resTwo = crdtElementGraph.getConnectedVertices("vertex-two");
      const resThree = crdtElementGraph.getConnectedVertices("vertex-three");

      expect(resOne.map(({ vertex }) => vertex)).to.have.members([
        "vertex-two",
        "vertex-three",
      ]);
      expect(resTwo.map(({ vertex }) => vertex)).to.have.members([
        "vertex-one",
        "vertex-three",
      ]);
      expect(resThree.map(({ vertex }) => vertex)).to.have.members([
        "vertex-one",
        "vertex-two",
      ]);
    });
  });

  describe("Find Path", () => {
    it("find path between ends of v-shaped graph", async () => {
      crdtElementGraph.addVertex("vertex-one");
      crdtElementGraph.addVertex("vertex-two");
      crdtElementGraph.addVertex("vertex-three");

      crdtElementGraph.addEdge("vertex-one", "vertex-two");
      crdtElementGraph.addEdge("vertex-two", "vertex-three");

      const res = crdtElementGraph.findPath("vertex-one", "vertex-three");

      expect(res).to.eql(["vertex-one", "vertex-two", "vertex-three"]);
    });

    it("check if connected for a graph with 2 connected componenets", async () => {
      crdtElementGraph.addVertex("vertex-one");
      crdtElementGraph.addVertex("vertex-two");
      crdtElementGraph.addVertex("vertex-three");
      crdtElementGraph.addVertex("vertex-four");
      crdtElementGraph.addVertex("vertex-five");
      crdtElementGraph.addVertex("vertex-six");

      crdtElementGraph.addEdge("vertex-one", "vertex-two");
      crdtElementGraph.addEdge("vertex-two", "vertex-three");
      crdtElementGraph.addEdge("vertex-three", "vertex-four");
      crdtElementGraph.addEdge("vertex-five", "vertex-six");

      const resOne = crdtElementGraph.findPath("vertex-one", "vertex-four");
      const resTwo = crdtElementGraph.findPath("vertex-one", "vertex-six");

      expect(resOne).to.eql([
        "vertex-one",
        "vertex-two",
        "vertex-three",
        "vertex-four",
      ]);
      expect(resTwo).to.have.length(0);
    });
  });

  describe("Merge Graphs", () => {
    it("gets merged graph from two graphs with added and removed vertices", async () => {
      const crdtElementGraphTwo = new CrdtElementGraph();

      crdtElementGraph.addVertex("vertex-one");
      crdtElementGraphTwo.addVertex("vertex-one");
      await delay(10);
      crdtElementGraph.addVertex("vertex-two");
      crdtElementGraphTwo.addVertex("vertex-two");
      await delay(10);
      crdtElementGraph.addVertex("vertex-three");

      crdtElementGraph.addEdge("vertex-one", "vertex-two");
      crdtElementGraphTwo.addEdge("vertex-one", "vertex-two");
      await delay(10);
      crdtElementGraph.addEdge("vertex-two", "vertex-three");
      await delay(10);
      crdtElementGraph.addEdge("vertex-three", "vertex-one");
      await delay(10);
      crdtElementGraphTwo.removeEdge("vertex-one", "vertex-two");

      const mergedTwoPSet = CrdtElementGraph.merge(
        crdtElementGraph,
        crdtElementGraphTwo
      );

      const vertices = mergedTwoPSet.vertices;
      const edges = mergedTwoPSet.edges;

      expect(vertices.map(({ vertex }) => vertex)).to.eql([
        "vertex-one",
        "vertex-two",
        "vertex-three",
      ]);
      expect(edges.map(({ edge }) => edge)).to.eql([
        ["vertex-two", "vertex-three"],
        ["vertex-three", "vertex-one"],
      ]);
    });
  });
});

//dont add edge to same vertex
