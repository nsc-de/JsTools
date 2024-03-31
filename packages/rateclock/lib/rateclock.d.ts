export declare class RateClock {
    readonly entityAmount: number;
    readonly timeout: number;
    private readonly entities;
    private readonly unused;
    private readonly waiting;
    constructor(entityAmount: number, timeout: number);
    private entityReady;
    acquire(): Promise<void>;
}
export default RateClock;
