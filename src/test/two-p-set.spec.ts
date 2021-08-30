import { expect } from "chai";
import { TwoPSetElement } from "../element-node";
import { TwoPSet } from "../two-p-set";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

describe("Two-P set", () => {
  let twoPSet: TwoPSet<TwoPSetElement>;

  beforeEach(() => {
    twoPSet = new TwoPSet();
  });

  describe("Add Element", () => {
    it("adds element to Set", () => {
      const original = new TwoPSetElement("element-one", 1);
      const res = twoPSet.add(original);

      expect(res.id).to.be.equal("element-one");
      expect(res.hash()).to.be.equal(original.hash());
      expect(res.created).to.be.equal(1);
    });

    it("errors when trying add element to Set if used id", () => {
      const original = twoPSet.add(new TwoPSetElement("element-one", 1));
      const res = () => twoPSet.add(new TwoPSetElement("element-one", 1));

      expect(res).to.throw(
        `Element with key: ${original.hash()} already exists.`
      );
    });
  });

  describe("Exists Element", () => {
    it("check element exists in Set after add", () => {
      const original = twoPSet.add(new TwoPSetElement("element-one", 1));
      const res = twoPSet.exists(original.hash());

      expect(res).to.be.true;
    });

    it("check element exists in Set after add, remove", async () => {
      const original = twoPSet.add(new TwoPSetElement("element-one", 1));
      await delay(20);
      twoPSet.remove(original.hash());
      const res = twoPSet.exists(original.hash());

      expect(res).to.be.false;
    });
  });

  describe("Remove Element", () => {
    it("remove element from Set", async () => {
      const original = twoPSet.add(
        new TwoPSetElement("element-one", Date.now())
      );
      await delay(20);
      const res = twoPSet.remove(original.hash());

      expect(res.id).to.be.equal(original.id);
      expect(res.created).to.be.greaterThan(original.created);
    });

    it("errors when trying remove element to Set if no element with id", () => {
      const res = () => twoPSet.remove("some-hash");

      expect(res).to.throw(`Element with key: some-hash does not exist.`);
    });
  });

  describe("Get Effective Adds", () => {
    it("get Effective Adds after add", () => {
      const original = twoPSet.add(
        new TwoPSetElement("element-one", Date.now())
      );

      const res = twoPSet.getEffectiveAdds();

      expect(res).to.have.length(1);
      expect(res).to.have.members([original]);
    });

    it("get empty Effective Elements after add, remove", () => {
      const original = twoPSet.add(
        new TwoPSetElement("element-one", Date.now())
      );
      twoPSet.remove(original.hash());

      const res = twoPSet.getEffectiveAdds();

      expect(res).to.have.length(0);
    });
  });

  describe("Get Effective Removes", () => {
    it("get Effective Elements Removes after add", () => {
      twoPSet.add(new TwoPSetElement("element-one", Date.now()));

      const res = twoPSet.getEffectiveRemoves();

      expect(res).to.have.length(0);
    });

    it("get empty Effective Removes after add, remove", () => {
      const original = twoPSet.add(
        new TwoPSetElement("element-one", Date.now())
      );
      twoPSet.remove(original.hash());

      const res = twoPSet.getEffectiveRemoves();

      expect(res).to.have.length(1);
      expect(res.map(({ id }) => id)).to.have.members([original.id]);
    });
  });
});
