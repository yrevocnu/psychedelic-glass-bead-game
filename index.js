import env from 'dotenv';
import * as discord from './lib/services/discord.js';
import * as app from './lib/app.js';

env.config();

(async () => {
  await Promise.all([
    discord.init(),
    app.init()
  ]);
})();