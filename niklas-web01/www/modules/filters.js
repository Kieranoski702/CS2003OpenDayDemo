import { getSongs } from './songlist.js';

/**
 * A function for filtering lists of HTML elements based on their metadata.
 *
 * A filter is a function that returns whether the element meets the filtering criteria based on its
 * attribute data. Filters are combined and ran using {@linkcode applyFilters}.
 *
 * The element's data-attributes (HTML attributes prefixed with {@code data-}, accessible using
 * {@code elem.dataset}) are used as input for the filters. For songlists, each element will have at
 * least the following properties:
 *
 * - elemData.album - the album the song is in.
 * - elemData.title - the title of the song.
 * - elemData.artist - the artist(s) of the song.
 * - elemData.year - the year the song was released.
 *
 * @callback filter
 * @param {object} elemData - an object containing the data attributes of a single element in the
 * element list.
 * @returns {boolean} - whether the filter criteria is met for the particular element.
 */

/**
 * Creates a filter that looks for a given value in the given attribute.
 *
 * @param {string} attribute
 * @param {string} value
 * @returns {filter}
 * @see byAlbum
 * @see byYear
 */
function byAttr(attribute, value) {
  return (elemdata) => elemdata[attribute] === value;
}

/**
 * Creates a filter to select songs from a specified album.
 *
 * @param {string} album
 * @returns {filter}
 */
export function byAlbum(album) {
  return byAttr('album', album);
}

/**
 * Creates a filter to select songs released in a specified year.
 *
 * @param {string} year
 * @returns {filter}
 */
export function byYear(year) {
  return byAttr('year', year);
}

/**
 * Gets the list of albums contained in this song list.
 *
 * @param {HTMLUListElement} songlist
 * @returns {string[]} - a unique list of album names.
 */
export function getAlbumList(songlist) {
  const songs = getSongs(songlist);
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName#filtering_the_results_using_array_methods
  const albums = Array.prototype.map.call(songs, (elem) => elem.dataset.album);

  // To filter for unique, check the index where the album first occurs. If its not the index of the
  // current element (i.e. the album is elsewhere in the list), remove.
  const uniqueAlbums = albums.filter((album, index) => {
    const firstOccurence = albums.findIndex((val) => val === album);
    return firstOccurence === index;
  });

  return uniqueAlbums;
}

/**
 * Gets the list of release-years contained in this song list.
 *
 * @param {HTMLUListElement} songlist
 * @returns {number[]} -  a unique list of years.
 */
export function getYearList(songlist) {
  const songs = getSongs(songlist);
  const years = Array.prototype.map.call(songs, (elem) => elem.dataset.year);

  // To filter for unique, check the index where the album first occurs. If its not the index of the
  // current element (i.e. the album is elsewhere in the list), remove.
  const uniqueYears = years.filter((year, index) => {
    const firstOccurence = years.findIndex((val) => Number(val) === Number(year));
    return firstOccurence === index;
  });

  return uniqueYears;
}

/**
 * Creates a filter that checks for the presence of some text in the song metadata.
 *
 * This filter searches across title, album, year, and artist. Each word (delimited by whitespace)
 * in the input must be contained in atleast one of these fields for the filter to succeed.
 *
 * Some example queries:
 *
 * - "1965 the" matches songs released in 1965 with "the" in the title.
 * - "Yellow Submarine the" matches songs from the album "Yellow Submarine" with "the" in the title.
 *
 * @param {string} queryString - the search query.
 * @returns {filter}
 */
export function search(queryString) {
  const words = queryString.trim().split(' ');
  const exprs = words.map((word) => new RegExp(`.*${word}.*`, 'i'));

  return (elemData) => {
    // Check if each word expression has a match in any of (album,title,year)
    const isWordMatch = exprs.map((expr) => {
      const titleMatch = expr.test(elemData.title);
      const yearMatch = expr.test(elemData.year);
      const albumMatch = expr.test(elemData.album);
      const aritstMatch = expr.test(elemData.artist);
      return titleMatch || yearMatch || albumMatch || aritstMatch;
    });
    // AND matches together - all words must have a match in some field.
    return isWordMatch.reduce((curr, prev) => curr && prev);
  };
}

/**
 * Apply the specified filters on the songlist.
 *
 * {@code applyFilters} first combines the filters (using AND). Then, it applies it to the songlist,
 * given each element not in the critera the hidden attribute.
 *
 * This implicitly resets previous filters applied.
 *
 * @param {HTMLUListElement} songlist - the songlist to apply the filters on.
 * @param {filter[]} filters - the filters to apply to the songlist.
 */
export function applyFilters(songlist, ...filters) {
  const predicate = filters.reduce((curr, prev) => (elemData) => curr(elemData) && prev(elemData));
  const songs = getSongs(songlist);
  Array.prototype.filter.call(songs, (elem) => !predicate(elem.dataset)).forEach((elem) => elem.setAttribute('hidden', ''));
  Array.prototype.filter.call(songs, (elem) => predicate(elem.dataset)).forEach((elem) => elem.removeAttribute('hidden'));
}
