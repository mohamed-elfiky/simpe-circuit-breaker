import { CircuitBreakerStateEnum } from "./circuit-breaker.enum";

export interface ICircuitBreakerStateStore{
    state: CircuitBreakerStateEnum,
    lastException: Error,
    lastChangedDate: Date,
    failedRequest(): number,
    trip(err: Error): void,
    reset(): void,
    halfOpen(): void,
    isClosed(): boolean,
}
