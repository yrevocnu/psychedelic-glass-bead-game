import Card from '../models/Card.js';
import Game from '../models/Game.js';
import Deck from '../models/Deck.js';

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
  let deckName = req.query.deck;

  if (!deckName) {
    res.status = 400;
    return res.send('You must provide a deck name!');
  }

  const deck = await Deck.findOne({ name: new RegExp(`${deckName}`, 'i') }).lean();

  if (!deck) {
    res.status = 400;
    return res.send(`Deck ${deckName} does not exist!`);
  }

  let game = await Game.findOne({}).lean();
  
  if (!game) {
    game = await Game.create({});
  }

  const blacklist = game.cards;

  const cards = await Card
    .aggregate()
    .match({ _id: { $nin: blacklist }, deck: deck._id })
    .sample(1);

  const card = cards[0];

  if (!card) {
    res.statusCode = 400;
    return res.send('There are no more cards to draw!');
  }

  await Game.updateOne({ _id: game._id }, { $push: { cards: card._id }});

  res.json(card);
}
