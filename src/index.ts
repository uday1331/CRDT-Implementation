import { GraphNode } from "./graph-node";
import { VersionedGraph } from "./versioned-graph"

class CvRDTGraph {
  private _addGraph: VersionedGraph;
  private _removeGraph: VersionedGraph;

  constructor(){
    this._addGraph = new VersionedGraph()
    this._removeGraph = new VersionedGraph()
  }

  public addVertex(id: string) {
    this._addGraph.addVertex(id);
  }

  public removeVertex(id: string) {
    if(this._removeGraph.getConnectedVertices(id) != null){
      throw new Error("Cannot remove vertex with existing edges.")
    }
    this._removeGraph.addVertex(id);
  }

  public addEdge(u: string, v: string){
    this._addGraph.addEdge(u, v);
  }

  public removeEdge(u: string, v: string){
    this._removeGraph.addEdge(u, v);
  }

  public vertexExists(id: string): boolean {
    const addedVertex = this._addGraph.getVertex(id);
    const removedVertex = this._removeGraph.getVertex(id);

    if( !addedVertex 
      ||( removedVertex 
        && addedVertex.created < removedVertex.created
      )){
      return false;
    }

    return true;
  }

  public getConnectedVertices(id: string): (Array<GraphNode> | null) {
    const addedVertices = this._addGraph.getConnectedVertices(id);
    const removedVertices = this._removeGraph.getConnectedVertices(id);

    if(!removedVertices){
      return addedVertices;
    }



    return null;
  }
}

// complete get connected
// add and remove need to be updated to remove edges when vertices removed
//TODO: add generics 