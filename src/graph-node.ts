import { v4 as uuid } from "uuid"

class GraphNode {
  private _created: number;
  private _id: string;

  constructor (
      id: string = uuid(), 
      created: number = Date.now()
    ) {
    this._created = created;
    this._id = id;
  }

  public get id(): string {
    return this._id;
  }

  public get created(): number{
    return this._created;
  }
}

export { GraphNode }