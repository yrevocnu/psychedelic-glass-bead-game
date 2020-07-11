import express from 'express';
import cors from 'cors';
import log from './log.js';
import * as game from './routes/game.js';
import * as decks from './routes/decks.js';
import * as user from './routes/user.js';

const app = express();
export const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.static('assets'));

app.get('/game', game.get);
app.post('/game', game.create);
app.post('/game/draw', game.draw);
app.get('/decks', decks.get);
app.get('/login', user.login);
app.get('/login/redirect', user.redirect);

export default app;

export function init() {
  app.listen(port, () => log.info(`STATUS: EXPRESS READY @ http://localhost:${port}`));
}
