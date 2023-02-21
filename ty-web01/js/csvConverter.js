/*
 * Opening a csv file to read.
 */

const class_file_name = "../TheBeatlesCleaned.csv";
const fs = require('fs');
/**
 *checks if the file exists and processes if so
 * @param filename the filepath to use.
 */
let checkAndProcessIfOK = function (filename) {
  //fs.exists is depreciated, I have replaced it with fs.existsSync as that's not depreciated
  if (fs.existsSync(filename)) {
    fs.stat(filename, function (err, stats) {
      if (stats.isDirectory()) {
        console.log(filename + ": is a directory");
      } else {
        processFile(filename)
      }
    })
  } else {
    console.log(filename + ": no such file");
  }
}

/**
 * a constructor for each song in json format to pass to an array.
 * @param id
 * @param year
 * @param album
 * @param song
 * @param danceability
 * @param energy
 * @param speechiness
 * @param acousticness
 * @param liveness
 * @param valence
 * @param length
 * @constructor
 */
function Songs(id, year, album, song, danceability, energy, speechiness, acousticness, liveness, valence, length) {
  this.id = id
  this.year = year
  this.album = album
  this.songTitle = song
  this.danceability = danceability
  this.energy = energy
  this.speechiness = speechiness
  this.acousticness = acousticness
  this.liveness = liveness
  this.valence = valence
  this.duration = convertTime(length)
}

/**
 *converts the miliseconds into 0 padded minutes and secconds
 * @param length
 * @returns {string}
 */
let convertTime = function (length) {
  const millisecs = length
  const seconds = Math.round((millisecs / 1000) % 60);
  const minutes = Math.floor((millisecs / 1000 / 60) % 60);
  return [minutes.toString().padStart(1, "0"), seconds.toString().padStart(2, "0")].join(":")
}
/**
 * processes the csv file, splitting it into rows and turning each row into an object to push to an array, then writes
 * the array to an external file.
 * @param filename the filepath used
 */
let processFile = function (filename) {

  let text = fs.readFileSync(filename).toString('utf-8'); // read the file and convert buffer to string
  let lines = text.split("\n")
  let songs = []

  let count = 0;
  for (line of lines) {
    if (count !== 0) {
      let columns = line.split(";")
      let id = columns[0]
      let year = columns[1]
      let album = columns[2]
      let name = columns[3]
      let danceability = columns[4]
      let energy = columns[5]
      let speechiness = columns[6]
      let acousticness = columns[7]
      let liveness = columns[8]
      let valence = columns[9]
      let length = columns[10]
      let next = new Songs(id, year, album, name, danceability, energy, speechiness, acousticness, liveness, valence, length)
      songs.push(next)
    }
    count++
  }
  //gets rid of the last item in the array as it's not valid info, absolutely horrific hacky way to do it, but it works.
  songs.length -= 1;

  fs.writeFile(
    './songs.json',
    //the extra arguments in stringify here just format the json file to be more human-readable for debugging purposes.
    JSON.stringify(songs, null, 1),

    function (err) {
      if (err) {
        console.error('error writing to json file.');
      }
    }
  );
}

checkAndProcessIfOK(class_file_name)
