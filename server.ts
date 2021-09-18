import express from 'express';

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log("server is running")
});

const responses = [(_req: express.Request, _res: express.Response) => {throw new Error('server failed')}, 
                    (_req: express.Request, res: express.Response) => {res.send('success')}];

app.get('/health', (req, res) => {
    const randomElement = responses[Math.floor(Math.random() * responses.length)];
    randomElement(req, res);
});




