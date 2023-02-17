"use strict";
var fs = require("fs");
// Gets the CSV file from the command line arguments
var filePath = process.argv[2];
// Read the CSV file
var data = fs.readFileSync(filePath).toString().trim();
// Turn the CSV file into a JSON file
const csvIntoJson = (csv, separator) => {
    let [headers, ...rows] = csv.split('\n');
    headers = headers.split(separator);
    rows = rows.map(row => row.split(separator));
  
    return rows.reduce((jsonArray, row) => {
      const item = row.reduce((item, value, index) => {
        return {...item, [headers[index]]: value};
      }, {});
      return jsonArray.concat(item);
    }, []);
  };
  
// Create JSON file using converted CSV file
const jsonArray = csvIntoJson(data, ';');

let json = JSON.stringify(jsonArray);
fs.writeFileSync('TheBeatlesCleaned.json', json);