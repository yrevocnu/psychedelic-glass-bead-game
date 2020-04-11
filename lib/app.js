import express from 'express';
import log from './log.js';
import * as game from './routes/game.js';

const app = express();
const port = 8000;

app.post('/game', game.create);
app.post('/game/draw', game.draw);

export default app;

export function init() {
  app.listen(port, () => log.info(`STAUTS: EXPRESS READY @ http://localhost:${port}`));
}