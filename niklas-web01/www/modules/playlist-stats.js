/* eslint-disable no-param-reassign */

// See filters.js for info on good dom iteration

/**
 *
 * @param playlist
 */
function getTotalDuration(playlist) {
  const items = playlist.getElementsByClassName('playlist-item');
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName#filtering_the_results_using_array_methods
  // See also
  return Array.prototype.reduce.call(
    items,
    (prev, curr) => Number(prev) + Number(curr.dataset.durationMs),
    0,
  );
}

/**
 *
 * @param playlist
 */
function getSongCount(playlist) {
  const items = playlist.getElementsByClassName('playlist-item');

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName#filtering_the_results_using_array_methods
  return items.length;
}

/**
 *
 * @param playlist
 */
export function PlaylistStatBox(playlist) {
  const element = document.createElement('div');

  /**
   *
   * @param duration
   * @param count
   */
  function updateInnerHTML(count, duration) {
    element.className = 'playlist-stat-box';
    element.innerHTML = `
    The playlist has <em><span class="playlist-stat-count">${count} </span> songs</em> 
    and lasts for <em><span class="playlist-stat-duration">${duration}</span></em>`;
  }
  updateInnerHTML(0, '0:00');

  /* Keep track of song count and duration automatically on changes to the DOM. This, and the use of
   * data attributes (see playlist.createPlaylistItem) keeps the DOM and the data linked, without
   * having to sync a data array and the DOM together when items are removed. Thanks again Mozilla
   * :)  https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
   *
   * Alternatively, I could just reference the data by id in a map elsewhere (i.e. the element holds
   * reference to the id of the song in an array)- however, this is unnecessary complexity for the
   * small amount of data / simple operations being held here.
   */

  // Create observer with callback to execute when mutations are observed
  // eslint-disable-next-line no-unused-vars
  const domObserver = new MutationObserver((_mutationList, _observer) => {
    // playlist.dataset.totalDurationMs = getTotalDuration(playlist);
    // playlist.dataset.songCount = getSongCount(playlist);
    const totalDurationMs = getTotalDuration(playlist);
    // mins -[x60]-> secs -[x1000]-> milisecs
    const mins = Math.floor(totalDurationMs / 60000);
    const secs = Math.floor((totalDurationMs % 60000) / 1000);
    updateInnerHTML(getSongCount(playlist), `${mins.toString().padStart(1, '0')}:${secs.toString().padStart(2, '0')}`);
  });
  domObserver.observe(playlist, { childList: true });

  return element;
}
