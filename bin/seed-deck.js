import commander from 'commander';
import fs from 'fs';
import Deck from '../app/models/Deck.js';
import Card from '../app/models/Card.js';
import csv from 'csvtojson';

const { program } = commander;

program
  .option('-p, --path <string>', 'path to assets')
  .option('-n, --name <string>', 'deck name')
  .option('-d, --description <string>', 'deck description')
  .parse(process.argv);

const imageFiles = fs.readdirSync(program.path);

(async () => {
  const cards = await csv().fromFile('./' + program.path + '.csv');
  const deck = await Deck.findOneAndUpdate(
    { name: program.name },
    { description: program.description },
    { new: true, upsert: true, returnNewDocument: true }).lean();

  if (!deck) {
    process.exit(1);
  }
  
  for (const card of cards) {
    if (card.File && !imageFiles.includes(card.File)) {
      console.error(`Could not find image for card: ${card}`);
      continue;
    }

    await Card.findOneAndUpdate({
      name: card.Name,
      deck: deck._id
    }, { 
      suit: card.Suit,
      image: card.File,
      reverse: card.Reverse,
      description: card.Description
    }, { new: true, upsert: true, returnNewDocument: true });
  }
  console.log(`Upserted ${cards.length} cards in "${program.name}"`);
})();
