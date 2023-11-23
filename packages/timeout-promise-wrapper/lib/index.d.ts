export type Timeout = Promise<void> & {
    stop(): void;
    resolve(arg?: unknown): void;
    reject(arg?: unknown): void;
};
export default function timeout(timeout: number): Timeout;
export { timeout };
