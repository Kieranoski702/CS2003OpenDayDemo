const fs = require('fs');
const assert = require('assert');

/**
 *
 * @param year
 * @param album
 * @param title
 * @param artist
 * @param durationMinutes
 * @param durationSeconds
 * @param totalDurationMS
 */
function Song(year, album, title, artist, durationMinutes, durationSeconds, totalDurationMS) {
  this.year = year;
  this.album = album;
  this.title = title;
  this.artist = artist;
  this.durationMinutes = durationMinutes;
  this.durationSeconds = durationSeconds;
  this.totalDurationMS = totalDurationMS;
}

// Adapted / inspired by example code on studres (web2.node092.csclass-a.js)
const processFile = function processFile(filename) {
  const text = fs.readFileSync(filename).toString('utf-8');
  const lines = text.split('\n');
  const songs = [];

  // eslint-disable-next-line no-restricted-syntax, no-undef
  for (line of lines.slice(1)) {
    // eslint-disable-next-line no-undef
    const cols = line.split(';');
      // Blank line - skip
    if (cols.length == 1) {
        continue
    }
    assert.equal(11,cols.length,`Each row should have 11 columns! The following row only has ${cols.length} columns. \n ${line}\n`)
    const year = cols[1];
    const album = cols[2];
    const song = cols[3];
    const durationM = Math.floor(cols[10] / 60000);
    const durationS = Math.floor(cols[10] / 1000) - durationM * 60;
    // eslint-disable-next-line eqeqeq
    if (album == undefined || song == undefined) {
      // eslint-disable-next-line no-continue
      continue;
    }
    songs.push(new Song(year, album, song, 'The Beatles', durationM, durationS, cols[10]));
  }

  return songs;
};

const songCsvToJSON = (sourceName, destinationName) => {
  fs.writeFileSync(destinationName, JSON.stringify(processFile(sourceName)));
};

//
const args = process.argv.slice(2); // 0: node 1: convert.js 2...n: arguments
assert.equal(1,args.length,`Got ${args.length} arguments, 1 expected.`)
const basename = args[0].slice(0,-4);
songCsvToJSON(args[0], `${basename}.json`);
