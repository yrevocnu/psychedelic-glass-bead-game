import mongoose from '../services/mongoose.js';

const schema = new mongoose.Schema({
  name: String,
  description: String
}, { timestamps: true });

schema.statics.list = () => {
  return Deck.find({}).select('name description').lean();
};

const Deck = mongoose.model('Deck', schema);

export default Deck;