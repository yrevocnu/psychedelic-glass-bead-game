import Discord from 'discord.js';
import log from '../../log.js';
import newGame from './newGame.js';
import draw from './draw.js';
import history from './history.js';

const HELP_MESSAGE = `the available commands are:
\`!new\` - start a new game
\`!draw {deck}\` - draw a card
\`!history\` - list the cards drawn this game
\`!history {username}\` - list the cards someone has drawn (multi-game)
\`!help\` - shows this message`;

const client = new Discord.Client();

client.on('message', async message => {
  const match = /!(\w+) ?(.*)?/.exec(message.content);

  if (!match) {
    return;
  }

  const command = match[1];
  const opt = match[2];

  switch(command) {
    case('new'): return newGame(message, opt);
    case('draw'): return draw(message, opt);
    case('history'): return history(message, opt);
    case('help'): return message.reply(HELP_MESSAGE);
  }
});

export function init() {
  if (process.env.TOKEN) {
    client.login(process.env.TOKEN);
  } else {
    log.error('No TOKEN env variable set!');
  }
}