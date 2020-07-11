import mongoose from '../services/mongoose.js';

const ObjectId = mongoose.Schema.Types.ObjectId;

const ACTIONS = {
  DRAW: 'draw'
};

const schema = new mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(ACTIONS),
  },
  user: {
    type: ObjectId, 
    ref: 'User'
  },
  game: {
    type: ObjectId,
    ref: 'Game'
  },
  card: {
    type: ObjectId, 
    ref: 'Card'
  }
}, { timestamps: true });

schema.statics.draw = function({ user, card, game }) {
  return Action.create({
    type: ACTIONS.DRAW,
    user: user._id,
    card: card._id,
    game: game._id
  });
};

const Action = mongoose.model('Action', schema);

export default Action;