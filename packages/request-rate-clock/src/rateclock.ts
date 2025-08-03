import timeout from "timeout-promise-wrapper";
import { randomBytes } from "crypto";

/**
 * A RateClock is a class that allows you to limit the rate of a certain operation.
 * For example you can limit the rate of API calls to 10 per second.
 * @author Nicolas Schmidt
 */
export abstract class RateClock {
  /**
   * Acquire a slot in the rate clock. This method will block until a slot is available.
   * @returns A promise that resolves when a slot is available.
   */
  abstract acquire(): Promise<void>;

  /**
   * Create a new RateClock with the given amount of operations per timeout.
   * @param amount The amount of operations that are allowed per timeout.
   * @param timeout The timeout in milliseconds. This is the time that has to pass before one operation slot is free again.
   * @returns A new RateClock instance.
   */
  static create(amount: number, timeout: number): RateClock {
    return new EntityRateClock(amount, timeout);
  }
}

/**
 * An entity for the EntityRateClock. This entity fires a promise when it is ready.
 * @author Nicolas Schmidt
 */
class EntityRateClockEntity {
  /**
   * The promise that is resolved when the entity is ready.
   * @internal
   */
  private promise: Promise<EntityRateClockEntity> = Promise.resolve(this);
  constructor(readonly timeout: number) {}

  /**
   * Use the entity. This method returns a promise that resolves when the entity is ready.
   * @returns A promise that resolves when the entity is ready.
   */
  use() {
    this.promise = timeout(this.timeout).then(() => this);
    return this.promise;
  }
}

/**
 * An EntityRateClock is a RateClock implementation that allows you to limit to {@link amount} operations per {@link timeout}.
 * @author Nicolas Schmidt
 */
export class EntityRateClock extends RateClock {
  /**
   * The entities that are used by the clock.
   * Allways contains {@link amount} entities.
   * @internal
   */
  private readonly entities: EntityRateClockEntity[] = [];

  /**
   * The entities that are not used / free.
   * @internal
   */
  private readonly unused: EntityRateClockEntity[] = [];

  /**
   * The waiting queue for acquire calls (contains the resolvers of the promises that are returned by acquire)
   * @internal
   */
  private readonly waiting: (() => void)[] = [];

  public readonly uid = randomBytes(16).toString("hex");

  /**
   * Constructs a new {@link EntityRateClock} with the given amount of entities and the given timeout.
   * @param amount The amount of entities that are used by the clock (for example 10 for 10 operations per {@link timeout})
   * @param timeout The timeout in milliseconds before one operation slot is free again (for example 1000 for 1 operation per second)
   */
  constructor(
    /**
     * The amount of entities that are used by the clock (for example 10 for 10 operations per {@link timeout})
     */
    readonly amount: number,

    /**
     * The timeout in milliseconds before one operation slot is free again
     * (for example 1000 for 1 operation per second)
     */
    readonly timeout: number,
  ) {
    super();
    // Create singular clocks
    for (let i = 0; i < amount; i++)
      this.entities.push(new EntityRateClockEntity(timeout));

    for (let i = 0; i < this.entities.length; i++)
      this.unused.push(this.entities[i]);
  }

  /**
   * Called when an entity is ready to be used again.
   * @param entity The entity that is ready to be used again.
   * @internal
   */
  private entityReady(entity: EntityRateClockEntity) {
    if (this.waiting.length > 0) {
      this.waiting.splice(0, 1)[0]();
      entity.use().then((e) => this.entityReady(e));
      return;
    }

    this.unused.push(entity);
    console.log("unused", this.unused.length);
  }

  /**
   * Acquire a slot in the rate clock. This method will block until a slot is available.
   * Implements {@link RateClock.acquire}
   * @returns A promise that resolves when a slot is available.
   */
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
