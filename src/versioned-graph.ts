import { GraphNode } from "./graph-node"

interface AdjacencyMapValue {
  self: GraphNode, 
  connectedVertices: Array<GraphNode>
}

interface AdjacencyMap {
  [key: string]: AdjacencyMapValue;
}

class VersionedGraph {

  private _numVertices: number;
  private _adjacencyMap: AdjacencyMap;

  constructor(vertices = 0){
    this._numVertices = vertices;
    this._adjacencyMap = Object();
  }

  public addVertex(id: string): GraphNode {
    if (this._adjacencyMap[id] === undefined){
      return this._adjacencyMap[id].self
    }

    const newNode = new GraphNode(id);

    this._numVertices = this._numVertices + 1;
    this._adjacencyMap[newNode.id] = 
    {
        self: newNode,
        connectedVertices: []
    }

    return newNode;
  }

  public addEdge(u: string, v: string)
  : ({
      uNode: GraphNode, 
      vNode: GraphNode
    }
    ) {
    if(this._adjacencyMap[u] === undefined || this._adjacencyMap[v] === undefined){
      throw new Error("Provided Vertices don't exist, you need to create them first.")
    }

    const timeStamp = Date.now()
    const uNode = new GraphNode(u, timeStamp)
    const vNode = new GraphNode(v, timeStamp)

    this._adjacencyMap[u].connectedVertices.push(vNode);
    this._adjacencyMap[v].connectedVertices.push(uNode);

    return {
      uNode, 
      vNode
    }
  }

  public getVertex(id: string): (GraphNode | null) {
    return (
      this._adjacencyMap[id] != undefined ? 
        this._adjacencyMap[id].self :
        null
    )
  }

  public getConnectedVertices(id: string): (Array<GraphNode> | null) {
    return (
      this._adjacencyMap[id] != undefined ? 
        this._adjacencyMap[id].connectedVertices :
        null
    )
  }
}

export { VersionedGraph }