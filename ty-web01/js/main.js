'use strict';
let totalLength = 0
let totalDuration = [0, 0]


fetch("./js/songs.json")
  .then((response) => {
    return response.json()
  })
  .then(data => data.forEach(addSong))
  .catch((err) => {
    console.log(err)
  })

/**
 * adds a song to the songs list
 * @param song the song json object
 */
function addSong(song) {
  const list = document.getElementById("songList")

  let data = document.createElement("li")

  data.innerHTML =
    `<div class="song-grid" id="${song.id}">
      <div class="albumCover"><img src="./img/${song.album} [${song.year}].png" alt="this is the album cover for ${song.album}"></div>
      <div class="songName">${song.songTitle}</div>
      <div class="albumtest">${song.album} [${song.year}]</div>
      <div class="duration">${song.duration}</div>
    </div>`;

  list.appendChild(data)

  document.getElementById(song.id).addEventListener("click", () => addToPlaylist(song.id));

  document.getElementById(song.id).addEventListener("mouseover",
    () => document.getElementById(song.id).classList.add("over"));

  document.getElementById(song.id).addEventListener("mouseout",
    () =>document.getElementById(song.id).classList.remove("over"));

}
/**
 * adds a song from the playlist, hides it in the song tab and updates the total length and duration
 * @param id the id of the song
 */
function addToPlaylist(id) {
  let songData = document.getElementById(id)
  let newID = id + "pl"
  const list = document.getElementById("playlist")
  let data = document.createElement("li")


  data.innerHTML =
    `<div class="song-grid" id=${newID}>
      <div class="albumCover"><img src="./img/${songData.children.item(2).innerHTML}.png" alt="this is the album cover for ${songData.children.item(2).innerHTML}"></div>
      <div class="songName">${songData.children.item(1).innerHTML}</div>
      <div class="album">${songData.children.item(2).innerHTML}</div>
      <div class="duration">${songData.children.item(3).innerHTML}</div>
    </div>`;
  list.appendChild(data)
  document.getElementById(newID).addEventListener("click", () => removeFromPlaylist(newID));
  document.getElementById(newID).addEventListener("mouseover",
    () => document.getElementById(newID).classList.add("over"));
  document.getElementById(newID).addEventListener("mouseout",
    () => document.getElementById(newID).classList.remove("over"));

  addLength()
  addDuration(songData.children.item(3).innerHTML)
  songData.classList.add("hidden")
}

/**
 * deletes a song from the playlist, unhides it in the song tab and updates the total length and duration
 * @param id the id of the song
 */
function removeFromPlaylist(id) {
  let songData = document.getElementById(id)
  document.getElementById(id.substring(0, id.length - 2)).classList.remove("hidden")
  removeLength()
  removeDuration(songData.children.item(3).innerHTML)
  songData.remove()
}

/**
 * adds one to total length and refreshes the website
 */
function addLength() {
  totalLength += 1
  document.getElementById("length").innerText = totalLength
}

/**
 * takes one away from total length and refreshes the website
 */
function removeLength() {
  totalLength -= 1
  document.getElementById("length").innerText = totalLength
}

/**
 * parses the duration of a song into ints then adds them from the total duration and refreshes it
 * @param time the duration of a song in minutes and seconds
 */
function addDuration(time) {
  time = time.split(":")
  totalDuration[0] += parseInt(time[0])
  totalDuration[1] += parseInt(time[1])
  if (totalDuration[1] >= 60) {
    totalDuration[1] -= 60
    totalDuration[0] += 1
  }
  document.getElementById("minutes").innerText = totalDuration[0].toString()
  document.getElementById("seconds").innerText = totalDuration[1].toString().padStart(2, "0")
}

/**
 * parses the duration of a song into ints then removes them from the total duration and refreshes it
 * @param time the duration of a song in minutes and seconds
 */
function removeDuration(time) {
  time = time.split(":")
  totalDuration[0] -= parseInt(time[0])
  totalDuration[1] -= parseInt(time[1])
  if (totalDuration[1] < 0) {
    totalDuration[1] += 60
    totalDuration[0] -= 1
  }
  document.getElementById("minutes").innerText = totalDuration[0].toLocaleString()
  document.getElementById("seconds").innerText = totalDuration[1].toLocaleString().padStart(2, "0")
}
