import { execSync } from 'child_process';

const decks = [{
  path: 'assets/decks/toth',
  name: 'Toth'
}, {
  path: 'assets/decks/chaos',
  name: 'Chaos'
}, {
  path: 'assets/decks/riderwaite',
  name: 'RiderWaite'
}, {
  path: 'assets/decks/jung',
  name: 'Jung'
}];

for (const deck of decks) {
  execSync(`yarn seed:deck -p ${deck.path} -n ${deck.name}`);
}