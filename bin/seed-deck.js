import commander from 'commander';
import fs from 'fs';
import Deck from '../lib/models/Deck';
import Card from '../lib/models/Card';
import csv from 'csvtojson';

const { program } = commander;

program
  .option('-p, --path <string>', 'path to assets')
  .option('-n, --name <string>', 'deck name')
  .parse(process.argv);

const files = fs.readdirSync(program.path);

(async () => {
  const cards = await csv().fromFile('./assets/decks/cards.csv');
  const deck = await Deck.findOneAndUpdate({ name: program.name }, {}, { new: true, upsert: true, returnNewDocument: true }).lean();

  if (!deck) {
    process.exit(1);
  }

  for (const file of files) {
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

  console.log(`Upserted ${files.length} cards in "${program.name}"`);
  process.exit();
})();