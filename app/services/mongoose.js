import mongoose from 'mongoose';
import log from '../log.js';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pgbg';
mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useFindAndModify: false,
  useCreateIndex: true 
});

const db = mongoose.connection;
db.on('error', err => log.error(err));
db.once('open', () => {
  log.info(`STATUS: MONGO READY @ ${uri}`);
});

export default mongoose;