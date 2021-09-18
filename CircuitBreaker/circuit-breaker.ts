import { CircuitBreakerStateStore } from "./circuit-breaker-state-store.service";
import { ICircuitBreakerStateStore } from "./ICircuit-breaker-state-store.interface";
import moment from "moment"
import { CircuitBreakerError } from "./circuit-breaker.error";
require('dotenv').config();

const DEFAULT_OPEN_TIMEOUT = 60;

export class CircuitBreaker {
    private stateStore: ICircuitBreakerStateStore = new CircuitBreakerStateStore();
    private openTimeOut: number;
    private threshold: number;
    constructor() {
        this.openTimeOut = +process.env.CIRCUIT_BREAKER_OPEN_TIMEOUT_MIN ?? DEFAULT_OPEN_TIMEOUT;
        this.threshold = +process.env.CIRCUIT_BREAKER_THRESHOLD ?? 5;
    }

    public async executeAction(action: any) {
        console.log('executing action', action);
        if (!this.stateStore.isClosed()) {
            console.log('circuit status: open')
            const lastChangedDate = moment(this.stateStore.lastChangedDate);
            const nextRetryDate = lastChangedDate.add(this.openTimeOut, 'second');
            const currentTime = moment(); 
            if (currentTime.isAfter(nextRetryDate)) {
                console.log('CircuitBreaker#executeAction:: timeout period passed, retrying');
                try {
                    this.stateStore.halfOpen();
                    await action();
                    console.log('CircuitBreaker#executeAction:: action success, resetting circuit state');
                    this.stateStore.reset();
                    return;
                } catch (error) {
                   this.stateStore.trip(error as Error);
                   throw error;
                }
            }
            throw new CircuitBreakerError("oops!!, open circuit");
        } 
        await this.proceedWithAction(action);
    }

    private async proceedWithAction(action: any) {
        console.log('circuit is closed, proceeding with request');
        try {
            const res = await action();
            console.log('circuit breaker#proceed with call: action success');
        } catch (error) {
            console.log('circuit breaker#proceed with call: action throw error');
            this.trackException(error as Error)
            throw error;
        }
    }

    private trackException(err: Error): void {
        console.log('CircuitBreaker#trackException: reporting for duty');
        if (this.stateStore.failedRequest() > this.threshold) {
            console.log('threshold reached, tripping now');
            this.stateStore.trip(err);
        }
    }
    
}