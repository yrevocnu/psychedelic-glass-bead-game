import request from 'supertest';
import app from '../../app.js';
import moment from 'moment';

export default async function history(message, opt) {
  const queryString = opt ? `?username=${opt}` : '';

  let actions;

  try {
    const response = await request(app).get(`/actions${queryString}`).expect(200);
    actions = response.body;
  } catch (err) {
    return message.reply(`user "${opt}" does not exist!`);
  }

  if (!actions.length) {
    return message.reply('there isn\'t any game history to show! Try `!history {username}` instead!');
  }

  const messages = actions.map(({ user, card, createdAt }) => {
    return `${user.auth.discord.username} drew ${card.name} from ${card.deck.name} ${moment(createdAt).fromNow()}`;
  });

  return message.reply(`\n${messages.join('\n')}`);
}
