import env from 'dotenv';
import * as discord from './app/services/discord.js';
import * as app from './app/app.js';

env.config();

(async () => {
  await Promise.all([
    discord.init(),
    app.init()
  ]);
})();