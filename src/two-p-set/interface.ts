export interface TwoPSetInterface<T> {
  add(element: T): T;
  remove(id: string): T;
  removeElement(element: T): T;
  exists(id: string): boolean;
  getEffectiveAdds(): Array<T>;
  getEffectiveRemoves(): Array<T>;
}

export interface TwoPSetElementInterface<T> {
  id: string;
  created: number;
  clone(): T;
  hash(): string;
}
