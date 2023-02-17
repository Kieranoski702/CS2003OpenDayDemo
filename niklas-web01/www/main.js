/* eslint-disable import/extensions */

import { Playlist, PlaylistItem } from './modules/playlist.js';
import { SongList } from './modules/songlist.js';
import { PlaylistStatBox } from './modules/playlist-stats.js';
import { FilterBox } from './modules/filterBox.js';

const data = await fetch('./data/TheBeatlesCleaned.json').then(((res) => res.json()));

// Initialise HTML elements.
const playlist = Playlist();
const songlist = SongList(data, (_, songData) => {
  // When the add button is clicked, add the song to the playlist.
  const newElem = PlaylistItem(playlist, songData);
  playlist.appendChild(newElem);
  newElem.focus();
});

const filterBox = FilterBox(songlist);

const playlistStatBox = PlaylistStatBox(playlist);

// Add them to the page
document.getElementById('songlist-container').appendChild(songlist);
document.getElementById('playlist-container').appendChild(playlist);
playlist.before(playlistStatBox);
songlist.before(filterBox);

// Dragging a song card to anywhere in the left side of the
// screen appends it to the default playlist.

// DROP (BUT NOT DRAG)
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

// Make this a drop zone:
playlist.ondragover = (event) => {
  event.preventDefault(); // the default is not to drag!
  // eslint-disable-next-line no-param-reassign
  event.dataTransfer.dropEffect = 'copy';
};

playlist.ondrop = (event) => {
  event.preventDefault(); // the default is not to drop!

  // This is also called when something is dropped on a child element.
  // Avoid this by checking the true target!
  if (event.target !== playlist) {
    return;
  }
  if (event.dataTransfer.types.includes('cs2003p/songjson')) {
    const draggedSongData = JSON.parse(event.dataTransfer.getData('cs2003p/songjson'));
    const newElem = PlaylistItem(playlist, draggedSongData);
    playlist.appendChild(newElem);
    newElem.focus();
  }
};
