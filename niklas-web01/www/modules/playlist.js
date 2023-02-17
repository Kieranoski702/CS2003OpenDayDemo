/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */

/**
 * @ignore
 */
let idCounter = 0;
/**
 * Returns a unique number to be used as part of a html id.
 *
 * @returns {number} a unique number.
 */
function getNextID() {
  idCounter++;
  return idCounter;
}

/**
 * Creates a playlist.
 *
 * @returns {HTMLOListElement}. a ol element with the classes card-holder and playlist.
 */
export function Playlist() {
  const element = document.createElement('ol');

  element.className = 'card-holder playlist';

  return element;
}

/**
 * Creates a playlist item.
 *
 * @param {HTMLOListElement} parent the playlist this item is in.
 * @param {import('./songlist.js').SongData} songData - the data of the song to be added.
 * @returns {HTMLLIElement}
 */
export function PlaylistItem(parent, songData) {
  const element = document.createElement('li');

  element.id = `playlist-item-${getNextID()}`;
  element.className = 'card playlist-item';

  // Make item focusable, but only via javascript, not keyboard
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
  element.setAttribute('tabindex', -1);
  // https://stackoverflow.com/questions/19053181/how-to-remove-focus-around-buttons-on-click
  // // https://stackoverflow.com/questions/8735764/prevent-firing-focus-event-when-clicking-on-div
  element.mousedown = (e) => { e.preventDefault(); e.stopImmedatePropagation(); };
  element.onclick = (e) => { e.preventDefault(); };
  /* Embed the data for the song within the list item as custom attributes
   * https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
   * this allows the data and DOM element to get linked without making more abstractions, or
   * doing some messy syncing thing to keep a data source and the DOM in sync with the correct
   * song data (e.g. when a song is deleted).
   *
   * An alternative is to use web components, but that is a bit too heavy-weight for this case.
   *
   * See also: playlist-stats.js
   */

  element.dataset.title = songData.title;
  element.dataset.album = songData.album;
  element.dataset.artist = songData.artist;
  element.dataset.durationMs = songData.totalDurationMS;

  const lengthString = `${songData.durationMinutes.toString().padStart(2, '0')}:${songData.durationSeconds.toString().padStart(2, '0')}`;

  element.innerHTML = `
  <div class="card-controls">
    <button class="playlist-item-up-button">&uarr;</button>
    <button class="playlist-item-down-button">&darr;</button>
    <button class="playlist-item-remove-button">x</button> 
    </div>

    <div>
      <span class="item-artist">${songData.artist} - </span>
      <span class="item-title">${songData.title}</span><br>
      <span class="item-info">(Album: ${songData.album}, Year: ${songData.year}, Duration: ${lengthString})</span>
    </div>`;

  // BUTTON HANDLERS

  element.getElementsByClassName('playlist-item-remove-button').item(0).onclick = () => {
    parent.removeChild(element);
  };

  element.getElementsByClassName('playlist-item-up-button').item(0).onclick = () => {
    const itemAbove = element.previousElementSibling;
    if (itemAbove !== null) {
      itemAbove.before(element);
    }
    element.focus();
  };

  element.getElementsByClassName('playlist-item-down-button').item(0).onclick = () => {
    const itemBelow = element.nextSibling;
    if (itemBelow !== null) {
      itemBelow.after(element);
    }
    element.focus();
  };

  // DRAG AND DROP
  // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

  element.setAttribute('draggable', 'true');

  element.ondragstart = (event) => {
    event.dataTransfer.setData('text/json', songData);
    event.dataTransfer.setData('text/plain', `${songData.artist}: ${songData.target}`);
    event.dataTransfer.setData('cs2003p/element', event.target.id);
  };

  // Make this a drop zone:
  element.ondragover = (event) => {
    event.preventDefault(); // the default is not to drag!
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'move';
  };

  element.ondrop = (event) => {
    event.preventDefault(); // the default is not to drop!

    // 1. An existing playlist item is dropped -> move it !
    if (event.dataTransfer.types.includes('cs2003p/element')) {
      const sourceID = event.dataTransfer.getData('cs2003p/element');
      const sourceItem = document.getElementById(sourceID);

      if (sourceItem == null) {
        return;
      }

      // This moves the item implicitly as only one of the item can exist in the DOM.
      // https://stackoverflow.com/q/1279957

      // Check to see which direction we are coming from, so that we can drop nicely.
      let isUp = false;

      // Iterate over elements to see which one appears first
      for (let i = 0; i < element.parentElement.children.length; i++) {
        if (element.parentElement.children[i] === sourceItem) {
          isUp = false;
          break;
        }
        if (element.parentElement.children[i] === element) {
          isUp = true;
          break;
        }
      }

      if (isUp) {
        element.before(sourceItem);
      } else {
        element.after(sourceItem);
      }
      sourceItem.focus();
      // 2. A new element is dropped
    } else if (event.dataTransfer.types.includes('cs2003p/songjson')) {
      const draggedSongData = JSON.parse(event.dataTransfer.getData('cs2003p/songjson'));
      const newElem = PlaylistItem(parent, draggedSongData);
      element.before(newElem);
      newElem.focus();
    }
  };

  return element;
}
