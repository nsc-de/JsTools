import { timeout } from "./prtimeout";

describe("prtimeout", () => {
  it("should timeout", async () => {
    let called = false;

    setTimeout(() => {
      called = true;
    }, 100);

    await timeout(200);

    expect(called).toBe(true);
  });

  it("should resolve", async () => {
    let called = false;

    setTimeout(() => {
      called = true;
    }, 100);

    const t = timeout(200);

    t.resolve();

    await t;

    expect(called).toBe(false);
  });
});
