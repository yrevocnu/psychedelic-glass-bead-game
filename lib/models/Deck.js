import mongoose from '../services/mongoose.js';

const schema = new mongoose.Schema({
  name: String,
  description: String
}, { timestamps: true });

export default mongoose.model('Deck', schema);