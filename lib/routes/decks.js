import Deck from '../models/Deck.js';

export async function get(req, res) {
  const decks = await Deck.find({}).lean();
  res.json(decks);
}