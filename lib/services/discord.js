import Discord from 'discord.js';
import log from '../log.js';
import request from 'supertest';
import app from '../app.js';
import Deck from '../models/Deck.js';

const WNOW_CHANNEL_ID = '698336752796041287';

// TODO: this link will break, add method to retrieve on launch
const WNOW_STREAM = 'https://video-weaver.mia02.hls.ttvnw.net/v1/playlist/CoUEwSs5jbpeRbrQGVABd5AwVHNdOCjVk03Ykcj558lvVKY3mSzDCxe86oZc3Lc-w4NjX_gkgxwQNw0vQmFwtbcGHuSL5BLZVNnuiyoFT0lgJzCh4zM3zVe5EqXPjDVMzjmOz9SvxIKcLRL_vEQatKxwN9LwHGm8dlcnxEaQ1rlHN3SSJ6VFtr5lEzMnP7BJI5OaaYIaNyh7KDAETJEQPgUVbNCpzhxkUCq86ZIySJ2BJpH6xA2y3cFyrupeS7WGr3pN9e9ZpOyBTHnSe2IedR3KNNsgVqDiZ3EMOlDmnQx9UTSEMRA7F1h6-dL18pFBJEJlB6S8gosZr9laHLAub0WvSYr6LtPccnVowrwIbwB_dmM-KSMYg1y7Qi1Ytcm2o-zfUejEIAl_ietYR7atUZbSoDvpbRduKKX1boHcm2Dgl2S-kG7wSStXc0X4O-xOmPis_3IsX61TEf7M-VqkfR-a1hpi_b0U-7ktOWznJQyjOWcEKO6s2xB2pHUto4wLxQi2uu-PKpcnKfIS0X2tXb5gJztZP_Ni-Pzf9V13_eLoaV1Mb8Ij1BKNcath2uYf2IsHNe-YexsZx6lRMNbSFkYhVulvngas1Za-1NdpwJdHzk9VU6EFu3YOuMlIzeErZJvv4wSlZQLhynmiyi4BVhYj5EUqEHzhjrAT6he6VJIcRgifBp5jNRIQQrDIwouAopNgaZChjQAGyxoMB6v_K1WZxagJelil.m3u8';

const client = new Discord.Client();

client.on('ready', async () => {
  log.info('STATUS: DISCORD READY');

  const wnowChannel = await client.channels.fetch(WNOW_CHANNEL_ID);
  const wnowConnection = await wnowChannel.join();
  wnowConnection.play(WNOW_STREAM).on('error', err => log.error(err));
});

client.on('message', async message => {
  if (!message.content.startsWith('!')) {
    return;
  }

  const match = /!(\w+) ?(.*)?/.exec(message.content);

  if (!match) {
    return;
  }

  const command = match[1];
  const opt = match[2];

  switch(command) {
    case('new'):
      const { body: game } = await request(app).post('/game');
      const newResponse = `Started new game: ${game._id}`;
      log.debug(`PGBG: ${newResponse}`);
      return message.channel.send(newResponse);
    case('draw'):
      const decks = await Deck.find({}).lean();
      const deckList = `Valid deck names are: **${decks.map(deck => deck.name).join(', ')}**`;
      if (!opt) {
        return message.reply(`you must provide a deck name, e.g. \`!draw Chaos\`. ${deckList}`)
      }
      
      const { body: card } = await request(app).post(`/game/draw?deck=${opt}`);
      
      if (!card || !card.image) {
        return message.reply(`deck "${opt}" does not exist! ${deckList}`);
      }
      
      const drawResponse = `drew ${card.image}`;
      log.debug(`PGBG: ${message.author.username} ${drawResponse}`);
      
      const embed = new Discord.MessageEmbed()
        .setTitle(card.name)
        .setDescription(card.description)
        .setFooter(card.suit)
        .attachFiles([`./assets/decks/${opt.toLowerCase()}/${card.image}`])
        .setImage(`attachment://${card.image}`);

      return message.reply(embed);
    default:
      return;
  }
});

export function init() {
  if (process.env.TOKEN) {
    client.login(process.env.TOKEN);
  } else {
    log.error('No TOKEN env variable set!');
  }
}