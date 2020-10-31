import Discord from 'discord.js';

export default async function echo(message, opt) {
  return message.reply(opt);
}