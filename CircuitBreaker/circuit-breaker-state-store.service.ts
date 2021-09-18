import { CircuitBreakerStateEnum } from "./circuit-breaker.enum";
import { ICircuitBreakerStateStore } from "./ICircuit-breaker-state-store.interface";

export class CircuitBreakerStateStore implements ICircuitBreakerStateStore{
    private _state: CircuitBreakerStateEnum;
    private _lastException: Error;
    private _lastChangedDate: Date;
    private _failedRequests: number;

    constructor(){
        this._state = CircuitBreakerStateEnum.CLOSED;
        this._lastChangedDate = new Date();
        this._lastException = new Error;
        this._failedRequests = 0;
    }

    get state() {
        return this._state;
    }

    get lastChangedDate() {
        return this._lastChangedDate;
    }

    set lastChangedDate(date: Date) {
        this._lastChangedDate = date;
    }

    get lastException(): Error {
        return this._lastException;
    }

    set lastException(err: Error) {
        this._lastException = err;
    }

    failedRequest(): number {
        console.log('failed requests: ', this._failedRequests + 1);
        return this._failedRequests++;
    }

    trip(err: Error): void {
        this._state = CircuitBreakerStateEnum.OPEN;
        this._lastException = err;
        this._lastChangedDate = new Date();
    }

    reset(): void {
        this._state = CircuitBreakerStateEnum.CLOSED;
        this._failedRequests = 0;
    }

    halfOpen(): void {
        this._state = CircuitBreakerStateEnum.HALF_OPEN;
    }
    
    isClosed(): boolean {
        return this._state === CircuitBreakerStateEnum.CLOSED
    }
}