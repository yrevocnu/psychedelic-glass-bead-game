import commander from 'commander';
import fs from 'fs';
import csvm from '../app/models/CSVModels.js';
import {rows} from '../app/models/CSVModels.js';

const { program } = commander;

program
// cruft templating...
//  .option('-p, --path <string>', 'path to assets')
//  .option('-n, --name <string>', 'deck name')
//  .option('-d, --description <string>', 'deck description')
  .parse(process.argv);

(async () => {
    for (var i in rows) {
        const row = rows[i]
        await csvm.findOneAndUpdate(
            row, row,
            { new: true, upsert: true, returnNewDocument: true }
            );    
    }
    
    process.exit();
})().catch(console.error)
.then((e) => {
    console.log(e);
    process.exit();
});
