import Card from '../models/Card.js';
import Game from '../models/Game.js';

import log from '../log.js';

export default async function gameDraw(deck) {

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
    throw new Error(`Deck ${deck._id} has no cards!`);
  }
  
  await Game.updateOne({ _id: game._id }, { $push: { cards: card._id }});

  log.debug(card);

  return card;
}
