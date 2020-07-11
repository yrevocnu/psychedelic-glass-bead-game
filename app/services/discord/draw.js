import Discord from 'discord.js';
import log from '../../log.js';
import request from 'supertest';
import app from '../../app.js';
import Deck from '../../models/Deck.js';
import User from '../../models/User.js';
import Action from '../../models/Action.js';
import Game from '../../models/Game.js';

let decks;

export default async function draw(message, opt) {

  if (!decks) {
    decks = await Deck.find({}).lean();
  }
  
  const deckNames = decks.map(deck => deck.name);
  const deckMessage = `Valid deck names are: **${deckNames.join(', ')}**`;
  
  if (!opt) {
    return message.reply(`you must provide a deck name, e.g. \`!draw Chaos\`. ${deckMessage}`);
  }

  if (!deckNames.map(name => name.toLowerCase()).includes(opt.toLowerCase())) {
    return message.reply(`deck "${opt}" does not exist! ${deckMessage}`);
  }

  // draw a card
  let card;
  
  try {
    const response = await request(app).post(`/game/draw?deck=${opt}`).expect(200);
    card = response.body;
  } catch (err) {
    return message.reply('Could not draw a card! Try starting a new game with `!new`');
  }

  log.debug(`PGBG: ${message.author.username} drew the ${card.name} of ${card.suit} - ${card.image}`);
    
  // build the message
  const embed = new Discord.MessageEmbed()
    .setTitle(card.name)
    .setDescription(card.description)
    .setFooter(card.suit)
    .attachFiles([`./assets/decks/${opt.toLowerCase()}/${card.image}`])
    .setImage(`attachment://${card.image}`);

  // ... and reply
  message.reply(embed);

  // discourse lets us know what user drew the card, so we create an action to track it
  const [user, game ] = await Promise.all([
    User.upsert({ 'auth.discord.id': message.author.id }, {
      'auth.discord.username': message.author.username
    }),
    Game.findOne().select('_id').lean()
  ]);

  return Action.draw({ user, card, game });
}