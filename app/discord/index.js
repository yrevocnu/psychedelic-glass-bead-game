import Discord from 'discord.js';
import log from '../log.js';
import newGame from './newGame.js';
import draw from './draw.js';
import decks from './decks.js';
import echo from './echo.js';
import jsvm from './jsvm.js';
import history from './history.js';

const HELP_MESSAGE = `the available commands are:
\`!new\` - start a new game
\`!decks\` - list available decks
\`!draw {deck}\` - draw a card
\`!history\` - list the cards drawn this game
\`!history {username}\` - list the cards someone has drawn (multi-game)
\`!echo {message}\` - echo message
\`!js {code}\` - evaluate arbitrary JavaScript safely in VM
\`!help\` - shows this message`;

const client = new Discord.Client();

client.on('message', async message => {
  const match = /^!(\w+) ?(.*)?/.exec(message.content);

  if (!match || message.author.bot) {
    return;
  }

  const command = match[1];
  const opt = match[2];

  switch(command) {
  // game commands
  case('new'): return newGame(message, opt);
  case('decks'): return decks(message, opt);
  case('draw'): return draw(message, opt);
  case('history'): return history(message, opt);

    // utility commands
  case('echo'): return echo(message, opt);
  case('js'): return jsvm(message, opt);
  case('help'): return message.reply(HELP_MESSAGE);
  }
});

export function init() {
  if (process.env.DISCORD_TOKEN) {
    client.login(process.env.DISCORD_TOKEN);
  } else {
    log.error('No DISCORD_TOKEN env variable set!');
  }
}
