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
  const deck = await Deck.findOneAndUpdate({ name: program.name }, { description: program.description }, { new: true, upsert: true, returnNewDocument: true }).lean();

  if (!deck) {
    process.exit(1);
  }

  for (const file of imageFiles) {
    const details = cards.find(card => card.File === file);

    if (!details) {
      console.error(`Could not find details for card: ${file}`);
      continue;
    }

    await Card.findOneAndUpdate({
      image: file,
      deck: deck._id
    }, { 
      suit: details.Suit, 
      name: details.Name, 
      description: details.Description 
    }, { new: true, upsert: true, returnNewDocument: true });
  }
  console.log(`Upserted ${imageFiles.length} cards in "${program.name}"`);
})();
