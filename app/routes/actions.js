import Action from '../models/Action.js';
import User from '../models/User.js';
import Game from '../models/Game.js';

export async function get(req, res) {
  const { username } = req.query;

  const match = {};

  if (username) {
    const user = await User
      .findOne({ 'auth.discord.username': new RegExp(username, 'i') })
      .select('_id')
      .lean();

    if (!user) {
      return res.sendStatus(404);
    }

    match.user = user._id;
  } else {
    // TODO: support multiple games
    const game = await Game.findOne().select('_id').lean();
    match.game = game._id;
  }

  const actions = await Action
    .find(match)
    .sort({ createdAt: -1 })
    .populate([{ 
      path: 'card',
      populate: {
        path: 'deck',
        model: 'Deck'
      } 
    },{ 
      path: 'user'
    }])
    .lean();
    
  res.json(actions);
}