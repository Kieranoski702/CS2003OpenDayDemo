"use strict";

/*==================== SONG OBJECT FUNCTION ====================*/
function Song(
  id,
  year,
  album,
  song,
  danceability,
  energy,
  speechiness,
  acousticness,
  liveness,
  valence,
  duration_ms
) {
  this.id = id;
  this.year = year;
  this.album = album;
  this.song = song;
  this.danceability = danceability;
  this.energy = energy;
  this.speechiness = speechiness;
  this.acousticness = acousticness;
  this.liveness = liveness;
  this.valence = valence;
  this.duration_ms = duration_ms;
}

/*==================== CREATE LIST OF SONGS FROM JSON ====================*/
// Array for all the song objects
const songs = [];
fetch("TheBeatlesCleaned.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // gets all the data from the fetched json file
    appendData(data);
    // Adds buttons to the list items
    createButtons();
  })
  .catch(function (err) {
    console.log(err);
  });
// Adds all the data to the list and creates a song object for each song
function appendData(data) {
  var songList = document.getElementById("songList");
  for (var i = 0; i < data.length; i++) {
    var listEntry = document.createElement("li");
    listEntry.className = "homeListItem";
    var convertedTime = millisToMinutesAndSeconds(data[i].duration_ms);
    songs[i] = new Song(
      data[i].id,
      data[i].year,
      data[i].album,
      data[i].song,
      data[i].danceability,
      data[i].energy,
      data[i].speechiness,
      data[i].acousticness,
      data[i].liveness,
      data[i].valence,
      data[i].duration_ms
    );
    listEntry.textContent =
      data[i].song +
      " (Album: " +
      data[i].album +
      ", Year: " +
      data[i].year +
      ", Duration: " +
      convertedTime +
      ")";
    listEntry.setAttribute("id", data[i].id);
    songList.appendChild(listEntry);
  }
}

/*==================== CONVERT TIME FUNCTION ====================*/
// Converts the time in milliseconds to the proper format laid out in the spec sheet
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}


/*==================== CREATE ADD BUTTONS FUNCTION ====================*/
function createButtons() {
  var a = document.getElementsByClassName("homeListItem");
  for (var v = 0; v < a.length; v++) {
    var btn = document.createElement("img");
    btn.className = "addButton";
    a[v].insertBefore(btn, a[v].firstChild);
  }
}

/*==================== ADD SONG TO PLAYLIST ====================*/
const songList = document.getElementById("songList");
const playlist = document.getElementById("playlist");

// Whenever the the add button is clicked the current list item is hidden and it is cloned to the playlist
songList.addEventListener("click", function (e) {
  if (
    e.target.parentNode.className == "homeListItem" &&
    e.target.className == "addButton"
  ) {
    playlist.appendChild(e.target.parentNode.cloneNode(true));
    e.target.parentNode.style.display = "none"
    var a = document.getElementsByClassName("homeListItem");
    // Adds remove button as it is now in the playlist
    for (var v = 0; v < a.length; v++) {
      if (a[v].parentNode.id == "playlist") {
        a[v].firstChild.remove();
        var removeButton = document.createElement("img");
        removeButton.className = "removeButton";
        a[v].insertBefore(removeButton, a[v].firstChild);
      }
    }
    updateSongCounter();
    var addSongID = e.target.parentNode.id;
    updateTotalDurationAdd(addSongID);
    updateAudioFeaturesAdd(addSongID);
  }
});

/*==================== REMOVE SONG FROM PLAYLIST ====================*/
// When the remove button is clicked the list item is removed from the playlist and the 
// song in the song list is displayed again
playlist.addEventListener("click", function (e) {
  if (
    e.target.parentNode.className == "homeListItem" &&
    e.target.className == "removeButton"
  ) {
    var songToMove = e.target.parentNode.cloneNode(true);
    var songID = songToMove.id;
    songList.children[songID-1].style.display = "flex"
    e.target.parentNode.remove();
    updateSongCounter();
    var removeSongID = e.target.parentNode.id;
    updateTotalDurationRemove(removeSongID);
    updateAudioFeaturesRemove(removeSongID);
  }
});

/*==================== PLAYLIST SONG COUNTER FUNCTION ====================*/

// Updates the song counter
function updateSongCounter() {
  var liList = document.getElementById("playlist").getElementsByTagName("li");
  var numberOfSongs = liList.length;
  document.getElementById("songCounter").innerText =
    "Number of songs: " + numberOfSongs;
}

/*==================== PLAYLIST TOTAL TIME FUNCTIONS ====================*/
let totalTimeMilliseconds = 0;
// Adds to the total duration based on the song
function updateTotalDurationAdd(songID) {
  totalTimeMilliseconds =
    parseFloat(totalTimeMilliseconds) + parseFloat(songs[songID -1].duration_ms);
  document.getElementById("totalDuration").innerText =
    "Total duration: " + millisToMinutesAndSeconds(totalTimeMilliseconds);
}
// Takes away from the total duration based on the song
function updateTotalDurationRemove(songID) {
  totalTimeMilliseconds =
    parseFloat(totalTimeMilliseconds) - parseFloat(songs[songID -1].duration_ms);
  document.getElementById("totalDuration").innerText =
    "Total duration: " + millisToMinutesAndSeconds(totalTimeMilliseconds);
}

/*==================== PLAYLIST AUDIO FEATURES FUNCTIONS ====================*/
let runningPercentageArray = [0, 0, 0, 0, 0, 0];
let headerArray = [
  "danceability",
  "energy",
  "speechiness",
  "acousticness",
  "liveness",
  "valence",
];
let totalSongs = 0;
// Adds every type of audio feature to it's respective bar based on the song
function updateAudioFeaturesAdd(songID) {
  for (let i = 0; i < headerArray.length; i++) {
    runningPercentageArray[i] =
      (parseFloat(totalSongs) * parseFloat(runningPercentageArray[i]) +
        parseFloat(songs[songID - 1][headerArray[i]] * 100)) /
      (parseFloat(totalSongs) + 1);
    document.getElementById(headerArray[i] + "Span").style.width =
      runningPercentageArray[i].toFixed(1) + "%";
    document.getElementById(headerArray[i] + "Count").innerText =
      runningPercentageArray[i].toFixed(1);
  }
  totalSongs = parseFloat(totalSongs) + 1;
  checkTotalSongsForSearch();
}
// Removes every type of audio feature from it's respective bar based on the song
function updateAudioFeaturesRemove(songID) {
  if (totalSongs == 1) {
    for (let i = 0; i < headerArray.length; i++) {
      runningPercentageArray[i] = 0;
      document.getElementById(headerArray[i] + "Span").style.width =
        runningPercentageArray[i].toFixed(1) + "%";
      document.getElementById(headerArray[i] + "Count").innerText =
        runningPercentageArray[i].toFixed(1);
    }
  } else {
    for (let i = 0; i < headerArray.length; i++) {
      runningPercentageArray[i] =
        (parseFloat(totalSongs) * parseFloat(runningPercentageArray[i]) -
          parseFloat(songs[songID - 1][headerArray[i]] * 100)) /
        (parseFloat(totalSongs) - 1);
      document.getElementById(headerArray[i] + "Span").style.width =
        runningPercentageArray[i].toFixed(1) + "%";
      document.getElementById(headerArray[i] + "Count").innerText =
        runningPercentageArray[i].toFixed(1);
    }
  }
  totalSongs = parseFloat(totalSongs) - 1;
  checkTotalSongsForSearch();
}

/*==================== CHECK FOR SONGS IN PLAYLIST FOR SEARCH FUNCTION ====================*/
// Changes visibility of playlist search bar based on songs in the playlist
function checkTotalSongsForSearch() {
  if (totalSongs == 0) {
    document.getElementById("search-buttonPlaylist").style.visibility =
      "hidden";
    document.getElementById("searchInputPlaylist").style.opacity = "0";
  } else {
    document.getElementById("search-buttonPlaylist").style.visibility =
      "visible";
  }
}

/*==================== SEARCH SONG LIST FUNCTIONS ====================*/
function searchSongList() {
  // Declare variables
  var input, filter, ul, li, i, txtValue;
  input = document.getElementById("searchInputSongList");
  filter = input.value.toUpperCase();
  ul = document.getElementById("songList");
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those that don't match the search query
  for (i = 0; i < li.length; i++) {
    txtValue = li[i].textContent || li[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

// Changes the visibility of the song list search bar
function showSearchBarSongList() {
  var searchBar = document.getElementById("searchInputSongList");
  if (searchBar.style.opacity == "1") {
    searchBar.style.opacity = "0";
    searchBar.style.visibility = "hidden"
  } else {
    searchBar.style.opacity = "1";
    searchBar.style.visibility = "visible"
  }
}

/*==================== SEARCH PLAYLIST FUNCTIONS ====================*/
function searchPlaylist() {
  // Declare variables
  var input, filter, ul, li, i, txtValue;
  input = document.getElementById("searchInputPlaylist");
  filter = input.value.toUpperCase();
  ul = document.getElementById("playlist");
  li = ul.getElementsByTagName("li");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    txtValue = li[i].textContent || li[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

// Changes the visibility of the playlist search bar
function showSearchBarPlaylist() {
  var searchBar = document.getElementById("searchInputPlaylist");
  if (searchBar.style.opacity == "1") {
    searchBar.style.opacity = "0";
    searchBar.style.visibility = "hidden"
  } else {
    searchBar.style.opacity = "1";
    searchBar.style.visibility = "visible"
  }
}

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

// Use user selected theme if they previously chose one
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

// Check if the user had a previously selected theme
if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
    iconTheme
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  // Save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});
