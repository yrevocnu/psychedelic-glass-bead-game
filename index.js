import * as discord from './app/discord/index.js';
import * as app from './app/app.js';

(async () => {
  await Promise.all([
    discord.init(),
    app.init()
  ]);
})();
