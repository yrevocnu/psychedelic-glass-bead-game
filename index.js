import * as discord from './app/services/discord/index.js';
import * as app from './app/app.js';

(async () => {
  await Promise.all([
    discord.init(),
    app.init()
  ]);
})();