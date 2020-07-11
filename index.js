import * as discord from './app/services/discord.js';
import * as app from './app/app.js';
import ngrok from 'ngrok';
import log from './app/log.js';

(async () => {
  if (process.env.NODE_ENV === 'development') {
    process.env.HOST = await ngrok.connect(app.port);
    log.info(`STATUS: HOSTNAME READY @ ${process.env.HOST}`);
  }

  await Promise.all([
    discord.init(),
    app.init()
  ]);
})();

process.on('exit', async () => {
  await ngrok.kill();
});