require("pixi-shim");

describe("GIVEN System", () => {
  it("THEN requiring it doesnt throw exception", () => {
    const req = () => require("../dist/");

    expect(req).not.toThrow();
  });

  describe("AND two cricles perfectly overlap", () => {
    it("THEN they give collision results", () => {
      const { System } = require("../dist/");

      const system = new System();

      system.createCircle({ x: 0, y: 0 }, 10);
      system.createCircle({ x: 0, y: 0 }, 10);

      system.checkAll((result) => {
        expect(result.aInB).toBeTruthy();
        expect(result.bInA).toBeTruthy();
      });
    });
  });

  describe("AND you adjust radius of circle collider", () => {
    it("THEN it gives collision results", () => {
      const { System } = require("../dist/");

      const system = new System();
      const circle = system.createCircle({ x: 0, y: 0 }, 10);

      system.createCircle({ x: 25, y: 0 }, 10);

      let collisions = 0;

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      circle.r = 20;

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      circle.updateAABB();

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(2);
    });
  });

  it("THEN you can change position within tree", () => {
    const { System } = require("../dist/");

    const system = new System();
    const circle = system.createCircle({ x: 0, y: 0 }, 10);

    expect(circle.x).toBe(undefined);
    expect(circle.y).toBe(undefined);

    expect(circle.system).toBe(system);

    circle.setPosition(1, -1);

    expect(circle.pos.x).toBe(1);
    expect(circle.pos.y).toBe(-1);
  });
});
