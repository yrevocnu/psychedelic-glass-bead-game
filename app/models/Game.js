import mongoose from '../services/mongoose.js';

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema({
  cards: {
    default: [],
    type: [{
      type: ObjectId, 
      ref: 'Card'
    }]
  }
}, { timestamps: true });

export default mongoose.model('Game', schema);
