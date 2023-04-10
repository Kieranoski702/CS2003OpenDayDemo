"use strict"

console.log("Search loaded")

function reset() { 

  // unhide all tracks
  library.querySelectorAll(".track, .track *").forEach((elem) => {
    elem.hidden = false; 
    elem.classList.remove("invisible")});
}


function search(string){

  let queryString = string.toLowerCase()

  // Some helper functios
  function hide(elem){
    elem.hidden = true; 
    elem.classList.add("invisible");

    elem.querySelectorAll(".track *").forEach((e) => {
      e.hidden = true; 
      e.classList.add("invisible")});
  }

  function show(elem){
    elem.hidden = false; 
    elem.classList.remove("invisible");

    elem.querySelectorAll(".track *").forEach((e) => {
      e.hidden = false; 
      e.classList.remove("invisible")});
  }


  // search all the tracks for substrings
  library.querySelectorAll(".track").forEach((track) => {
    let name = track.querySelector(".name").textContent.toLowerCase();
    let details = track.querySelector(".details").textContent.toLowerCase();

    if (name.search(queryString) > -1 || details.search(queryString) > -1) {
      show(track)
    }
    else {
      hide(track)
    }
  });

}


// handle search bar
const searchBar = document.querySelector("#search");
searchBar.oninput = () => {
  search(searchBar.value);
  };
