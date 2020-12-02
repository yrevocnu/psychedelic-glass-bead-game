import escape from 'escape-html';
import Deck from '../models/Deck.js';
import Game from '../models/Game.js';

import gameDraw from '../handlers/draw.js';

export async function get(req, res) {
  const game = await Game.findOne().populate({
    path: 'cards',
    model: 'Card',
    populate: {
      path: 'deck',
      model: 'Deck'
    }
  }).lean();

  return res.json(game);
}

export async function create(req, res) {
  let game = await Game.findOne().lean();

  if (game) {
    await Game.deleteOne({ _id: game._id });
  }

  game = await Game.create({});
  return res.json(game);
}

export async function draw(req, res) {
  let deckName = escape(req.query.deck);

  if (!deckName) {
    res.status = 400;
    return res.send('You must provide a deck name!');
  }

  const deck = await Deck.findOne({ name: new RegExp(`${deckName}`, 'i') }).lean();

  if (!deck) {
    res.status = 400;
    return res.send(`Deck ${deckName} does not exist!`);
  }

  const card = await gameDraw(deck);

  if (!card) {
    res.statusCode = 400;
    return res.send('There are no more cards to draw!');
  }

  res.json(card);
}
