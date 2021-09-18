import axios from 'axios';
import { CircuitBreaker } from './CircuitBreaker/circuit-breaker';

(async () => {
    const breaker = new CircuitBreaker();
    while(true) {
        await delay(5000);
        try {
            await breaker.executeAction(() => axios.get('http://localhost:3000/health'));
        } catch(error) {
            console.log('app: elevated error');
        }
    }
})();

async function delay(ms: number) {
    return new Promise(resolve => setTimeout( resolve , ms));
}