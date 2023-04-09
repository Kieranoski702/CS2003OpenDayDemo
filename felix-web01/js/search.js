"use strict"

console.log("Search loaded")

function reset() { // unhide all tracks
  library.querySelectorAll(".track *").forEach((track) => {
    track.hidden = false; 
    track.classList.remove("invisible")});

  // get pseudo element too
  library.querySelectorAll(".track").forEach((track) => {
    track.classList.remove("invisible")});
}


function search(){
  console.log("Not implemented")
  library.querySelectorAll(".track *").forEach((track) => {
    track.hidden = true; 
    track.classList.add("invisible")});

    // https://stackoverflow.com/questions/71097308/how-to-show-hidden-pseudo-element-with-javascript
  library.querySelectorAll(".track").forEach((track) => {
    console.log(track);
    track.classList.add("invisible")});
}
