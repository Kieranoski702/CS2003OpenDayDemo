/* eslint-disable no-use-before-define */
import { createDropDown } from './dropdown.js';
import * as filter from './filters.js';

/*
 * Creates a filter box for the given songlist.
 *
 * A filterbox gives the user dropdowns and a search bar to filter songs in the songlist according
 * to album, year, and title.
 *
 * Filtering is achieved by setting/unsetting the hidden attribute of song elements. @see
 * applyFilters
 *
 * @param songlist - the songlist to filter. @returns {HTMLDivElement} - the filterbox
 */
/**
 *
 * @param songlist
 */
export function FilterBox(songlist) {
  const element = document.createElement('div');
  element.className = 'filter-box';

  const searchBox = document.createElement('input');

  const yearDropdown = createDropDown('year', filter.getYearList(songlist), (dropDown) => {
    const selectedValue = dropDown.options[dropDown.selectedIndex].value;
    albumDropDown.selectedIndex = 0;
    const filters = [filter.search(searchBox.value)];
    // Something is selected
    if (yearDropdown.selectedIndex > 0) {
      filters.push(filter.byYear(selectedValue));
    }

    filter.applyFilters(songlist, ...filters);
  });

  const albumDropDown = createDropDown('album', filter.getAlbumList(songlist), (dropDown) => {
    const selectedValue = dropDown.options[dropDown.selectedIndex].value;
    yearDropdown.selectedIndex = 0;
    const filters = [filter.search(searchBox.value)];

    // Something is selected
    if (dropDown.selectedIndex > 0) {
      filters.push(filter.byAlbum(selectedValue));
    }
    filter.applyFilters(songlist, ...filters);
  });

  searchBox.type = 'text';
  searchBox.oninput = () => {
    const filters = [filter.search(searchBox.value)];
    if (yearDropdown.selectedIndex > 0) {
      filters.push(filter.byYear(yearDropdown.options[yearDropdown.selectedIndex].value));
    }
    if (albumDropDown.selectedIndex > 0) {
      filters.push(filter.byAlbum(yearDropdown.options[albumDropDown.selectedIndex].value));
    }
    filter.applyFilters(songlist, ...filters);
  };

  element.appendChild(albumDropDown);
  element.appendChild(yearDropdown);
  //  element.appendChild(document.createElement('br'));
  element.appendChild(searchBox);
  return element;
}
