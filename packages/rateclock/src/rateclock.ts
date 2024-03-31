import timeout from "timeout-promise-wrapper";

class RateClockEntity {
  private _promise: Promise<RateClockEntity> = Promise.resolve(this);
  constructor(readonly timeout: number) {}
  use() {
    this._promise = timeout(this.timeout).then(() => this);
    return this._promise;
  }
}

/**
 * Clock making sure we don't get problems with the rate limit
 */
export class RateClock {
  private readonly entities: RateClockEntity[] = [];
  private readonly unused: RateClockEntity[] = [];
  private readonly waiting: (() => void)[] = [];
  constructor(readonly entityAmount: number, readonly timeout: number) {
    // Create singular clocks
    for (let i = 0; i < entityAmount; i++)
      this.entities.push(new RateClockEntity(timeout));

    for (let i = 0; i < this.entities.length; i++)
      this.unused.push(this.entities[i]);
  }

  private entityReady(entity: RateClockEntity) {
    if (this.waiting.length > 0) {
      this.waiting.splice(0, 1)[0]();
      entity.use().then((e) => this.entityReady(e));
      return;
    }

    this.unused.push(entity);
  }

  acquire(): Promise<void> {
    if (this.unused.length > 0) {
      const clock = this.unused.pop()!;
      clock.use().then((e) => this.entityReady(e));
      return Promise.resolve();
    }

    return new Promise((rs) => {
      this.waiting.push(rs);
    });
  }
}

export default RateClock;
