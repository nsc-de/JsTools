import SavePromise from "./savepromise";
const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe("savePromise", () => {
  it("should save once", async () => {
    let count = 0;
    const { save } = SavePromise(async () => {
      await timeout(100);
      count++;
    });

    await save();
    expect(count).toBe(1);
  });

  it("should save twice", async () => {
    let count = 0;
    const { save } = SavePromise(async () => {
      await timeout(100);
      count++;
    });

    save();
    await save();
    expect(count).toBe(2);
  });

  it("should save twice when called three times", async () => {
    let count = 0;
    const it = SavePromise(async () => {
      await timeout(100);
      count++;
    });

    it.save();

    expect(it.promise).not.toBeDefined();
    expect(it.saving).toBe(true);
    expect(it.scheduled).toBe(false);

    it.save();

    expect(it.promise).toBeDefined();
    expect(it.saving).toBe(true);
    expect(it.scheduled).toBe(true);

    await it.save();
    expect(count).toBe(2);
  });

  it("test reject", async () => {
    let count = 0;
    const { save } = SavePromise(async () => {
      await timeout(100);
      count++;
      throw new Error("test");
    });

    await expect(() => save()).rejects.toThrow("test");
    await expect(() => save()).rejects.toThrow("test");

    expect(count).toBe(2);
  });
});
