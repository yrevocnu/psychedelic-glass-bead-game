import request from 'supertest';
import Discord from 'discord.js';
import app from '../../app.js';

export default async function decks(message) {
  const { body: decks } = await request(app).get('/decks/');
  const embed = new Discord.MessageEmbed()
    .addFields(decks.map(deck => ({
      name: deck.name,
      value: `\`!draw ${deck.name}\` - ${deck.description}`
    })));

  return message.reply(embed);
}
