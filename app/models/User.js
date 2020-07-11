import mongoose from '../services/mongoose.js';

const schema = new mongoose.Schema({
  auth: {
    discord: {
      id: String,
      username: String
    },
    discourse: {
      id: String,
      username: String
    },
  }
}, { timestamps: true });

schema.statics.upsert = function(match, update) {
  return User
    .findOneAndUpdate(match, update, { new: true, upsert: true, setDefaultsOnInsert: true })
    .select('_id')
    .lean();
};

const User = mongoose.model('User', schema);

export default User;