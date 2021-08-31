# CRDT Element Graph Implementation

## Introduction

I had a really fun time working on this project. During the time that I had, I experimented with two implementations and very quickly realised why the first (using 2 - adjacency list like structures) didn't work. For my implementation, I chose to stick to the mathematical example of 2P-2P sets where one is used for the set of vertices and one for edges.

I tried to isolated concerns as much as possible by separating out the 2P Set and the Graph itself both on implementation and tests.

## Sections

- [Examples](#examples)
- Clarifications
- Improvements

## Examples

You will not see any `index.ts` file in the project that has an example of how to use the interface. I have given some examples on how to use funcitons below next to their documentation. However, I do believe good tests can act as good documentation too :).

```
const crdtElementGraph = new CrdtElementGraph();
crdtElementGraph.addVertex("vertex-one");
crdtElementGraph.addVertex("vertex-two");
crdtElementGraph.addVertex("vertex-three");

crdtElementGraph.addEdge("vertex-one", "vertex-two");
crdtElementGraph.addEdge("vertex-two", "vertex-three");

crdtElementGraph.removeEdge("vertex-two", "vertex-three");
crdtElementGraph.removeVertex("vertex-three");

crdtElementGraph.existsVertex("vertex-two");
crdtElementGraph.existsEdge("vertex-two", "vertex-three");

crdtElementGraph.getConnectedVertices("vertex-two");

const path = crdtElementGraph.findPath("vertex-one", "vertex-two");

const mergedTwoPSet = CrdtElementGraph.merge(
  crdtElementGraph,
  crdtElementGraphTwo
);


```

# Clarifications

Wanted to mention some of the design choices I made. I may have forgotten to mention some things. Feel free to ask me about them. I tried to reason about most things before going with them.

- Using Depth First Search for Path Finding: Mainly because there was not requirment on it and I thought it was a bit more efficient to implement a stack with javascript's `Arrays` because of the `pop` and `push` functions

- For resolving conflicts between `add` and `remove` operations at the same time, I chose to give priority to `remove`. This is implemented in the `exists` function for `TwoPSet`.

- Followint a somewhat test based approach helped me thing of interesting things. In my current implementation, edges `["A", "B"]` and `["B", "A"]` count as the same because they get ordered alphabetically (desc) in the constructor for `CrdtElementGraphEdgeElement`.

# Improvements

- I believe I can possibly add more isolation particularly in the way the elements fed to the `TwoPSet` are used eg: `TwoPSetElement`, `CrdtElementGraphVertexElement` etc. Can make the tests more clean.
- Some of the tests for `CrdtElementGraph` can be replace by stubs that check for if the underlying functions in `TwoPSet` are called instead of having to re-test them end-to-end again.
- I do believe there is a more efficient implementation for the merge method. I'll research it till next round.
- Remove some of the clunk from the tests. There are a lot of repeated function calls that can be added to `BeforeEach()` statements. The test module for `CrdtElementGraph` can also be broken down into a couple of files.