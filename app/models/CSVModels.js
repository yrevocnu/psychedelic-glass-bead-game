import csv from 'csvtojson';
import mongoose from '../services/mongoose.js';

const name = 'inspiration'

// using the one csv in the repo for now.
// later, let this be variable.
const file_path = `./assets/decks/${name}/${name}.csv`

export const rows = await csv().fromFile(file_path);

const schema_data = {}

for (var header in rows[0]) {
    schema_data[header] = String;
}

// TODO: What is this for?
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema(
    schema_data, { timestamps: true });

const Model = mongoose.model(name, schema);

export default Model