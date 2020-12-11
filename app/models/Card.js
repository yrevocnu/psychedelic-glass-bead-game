import mongoose from '../services/mongoose.js';

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  reverse: String,
  suit: String,
  deck: {
    type: ObjectId, 
    ref: 'Deck'
  }
}, { timestamps: true });

export default mongoose.model('Card', schema);
