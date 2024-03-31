import { EntityRateClock } from "./rateclock";

jest.useFakeTimers();

describe("EntityRateClock", () => {
  let clock: EntityRateClock;

  beforeEach(() => {
    // Create a new EntityRateClock instance before each test
    clock = new EntityRateClock(10, 1000);
  });

  it("should acquire a slot when there are unused entities", async () => {
    await clock.acquire();
    expect(clock["unused"]).toHaveLength(9);
  });

  it("after acquiring a slot, it should be free again after the timeout", async () => {
    await clock.acquire();
    await jest.advanceTimersByTimeAsync(1000);
    expect(clock["unused"]).toHaveLength(10);
  });

  it("should acquire a slot when there are no unused entities", async () => {
    const promises = Array.from({ length: 10 }, () => clock.acquire());
    await Promise.all(promises);
    expect(clock["unused"]).toHaveLength(0);
    const lastPromise = clock.acquire();
    await jest.advanceTimersByTimeAsync(1000);
    await lastPromise;
    expect(clock["unused"]).toHaveLength(9);
  });
});

describe("RateClock", () => {
  describe("#create()", () => {
    it("should create a new EntityRateClock instance", () => {
      const clock = EntityRateClock.create(10, 1000);
      expect(clock).toBeInstanceOf(EntityRateClock);
    });
  });
});
