import Discord from 'discord.js';

export default async function d_eval(message, opt) {

    const out = eval(opt)

    return message.reply(out);
  }