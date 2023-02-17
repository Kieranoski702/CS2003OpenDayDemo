/* eslint-disable no-use-before-define */

// Type definitions for vscode linting and tool-tip purposes
/**
 * The metadata for a song.
 *
 * @typedef {object} SongData
 * @property {string} title
 * @property {string} artist
 * @property {string} album
 * @property {number} year
 * @property {number} durationMinutes
 * @property {number} durationSeconds
 * @property {number} totalDurationMS
 */

/**
 * A callback to be run when a song in a SongList is pressed.
 *
 * @callback songOnClick
 * @param {HTMLLIElement} element the element pressed.
 * @param {SongData} songData the data of the song clicked.
 */

/**
 * Creates a list of songs from the given data.

 * @param {SongData[]} data an array of songs.
 * @param {songOnClick} onAddButtonClick - the callback function to be ran when the
 * add button of a song in this list is pressed.
 * @returns {HTMLULElement} a list element containing the songs specified in the data.
 */
export function SongList(data, onAddButtonClick) {
  const element = document.createElement('ul');

  element.className = 'songlist card-holder';
  // Add data to song list
  data.forEach((value) => element.appendChild(SonglistItem(value, onAddButtonClick)));
  return element;
}

/**
 * Creates a list item to be put in a SongList.
 *
 * @param {SongData} songData - the metadata of the song to be added.
 * @param {songOnClick} onClick - a callback
 * function to run when the item is pressed.
 * @returns {HTMLLIElement} - a list item element displaying the song data, and with
 *   an add button with the behaviour specified by the callback.
 */
function SonglistItem(songData, onClick) {
  const element = document.createElement('li');

  element.className = 'songlist-item card';

  // For the rationale behind this, see playlist.createPlaylistItem
  element.dataset.title = songData.title;
  element.dataset.album = songData.album;
  element.dataset.artist = songData.artist;
  element.dataset.durationMs = songData.totalDurationMS;
  element.dataset.year = songData.year;

  const lengthString = `${songData.durationMinutes.toString().padStart(2, '0')}:${songData.durationSeconds.toString().padStart(2, '0')}`;

  element.innerHTML = `
      <span class="item-artist">${songData.artist} - </span>
      <span class="item-title">${songData.title}</span><br>
      <span class="item-info">(Album: ${songData.album}, Year: ${songData.year}, Duration: ${lengthString})</span>
      `;

  // Make button do stuff
  element.onclick = () => onClick(element, songData);

  // DRAG (but not drop).
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

  element.setAttribute('draggable', 'true');

  element.ondragstart = (event) => {
    event.dataTransfer.setData('text/json', JSON.stringify(songData));
    event.dataTransfer.setData('text/plain', `${songData.artist}: ${songData.target}`);
    // DESIGN NOTE:
    // this must be lowercase as uppercase types just get turned lowercase by the browser!
    event.dataTransfer.setData('cs2003p/songjson', JSON.stringify(songData));
  };
  return element;
}

/**
 *
 * @param songlist
 */
export function getSongs(songlist) {
  return songlist.getElementsByClassName('songlist-item');
}
