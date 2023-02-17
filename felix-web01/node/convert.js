"use strict"
var fs = require("fs");

let filepath = "data/TheBeatlesCleaned.csv";
const raw = fs.readFileSync(filepath, {encoding:'utf8'});

const rows = raw.split('\r\n');
const headers = rows[0].split(';');
const numCols = headers.length;

var out = []; // list of strings, each is a json object string

let row;
let vals;
for (let i = 1; i < rows.length; i++) {
    row = rows[i].split(';');
    if (row.length != numCols) continue; // skip invalid lines

    vals = [];
    for (let j = 0; j < numCols; j++) {
        vals.push(`"${headers[j]}":"${row[j]}"`);
    }
    out.push('{'+vals.join(', ')+'}');
}

let stringOut = '[\n  '+out.join(',\n  ')+'\n]'; // result neatly indented
fs.writeFileSync(filepath.replace(".csv", ".json"), stringOut);
