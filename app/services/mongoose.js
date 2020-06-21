import mongoose from 'mongoose';
import log from '../log.js';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pgbg', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = mongoose.connection;
db.on('error', err => log.error(err));
db.once('open', () => {
  log.info('STATUS: CONNECTED TO DB');
});

export default mongoose;