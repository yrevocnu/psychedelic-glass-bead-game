import { exec } from 'child_process';

// Note:
// path: entry refers to both directory with images
//       and path of csv file with deck data
//       i.e. assets/decks/toth.csv
const decks = [{
  path: 'assets/decks/toth',
  name: 'Toth',
  description: 'Beautiful, unsettling, powerful'
}, {
  path: 'assets/decks/chaos',
  name: 'Chaos',
  description: 'Graphically stunning, gentle'
}, {
  path: 'assets/decks/riderwaite',
  name: 'RiderWaite',
  description: 'Classical, fairy-tale-like'
}, {
  path: 'assets/decks/jung',
  name: 'Jung',
  description: 'Deeply psychological'
}, {
  path: 'assets/decks/yrevocnu',
  name: 'Yrevocnu',
  description: 'Maximum Viable Tarot'
}];

for (const deck of decks) {
  exec(`yarn seed:deck -p ${deck.path} -n ${deck.name} -d "${deck.description}"`).stdout.pipe(process.stdout);
}
