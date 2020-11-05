import Discord from 'discord.js';
import vm from 'vm'

export default async function jsvm(message, opt) {
  const contextObject = {
    // TODO: provide Game data as context
  };
  
  const out = vm.runInNewContext(opt, contextObject);

  return message.reply(out);
}