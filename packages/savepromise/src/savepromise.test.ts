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
    const { save } = SavePromise(async () => {
      await timeout(100);
      count++;
    });

    save();
    save();
    await save();
    expect(count).toBe(2);
  });
});
