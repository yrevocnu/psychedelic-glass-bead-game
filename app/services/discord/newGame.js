import request from 'supertest';
import app from '../../app.js';
import log from '../../log.js';

export default async function newGame(message) {
  const { body: game } = await request(app).post('/game');
  const response = `Started new game: ${game._id}`;
  log.debug(`PGBG: ${response}`);
  return message.channel.send(response);
}