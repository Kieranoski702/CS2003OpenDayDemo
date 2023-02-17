/**
 *
 * @param val
 */
function createOption(val) {
  const option = document.createElement('option');
  option.setAttribute('value', val);
  option.textContent = val;
  return option;
}

/**
 *
 * @param name
 * @param data
 * @param onChange
 */
export function createDropDown(name, data, onChange) {
  const element = document.createElement('select');
  element.setAttribute('name', name);
  element.appendChild(createOption(`Select ${name}`));

  data.forEach((val) => {
    element.appendChild(createOption(val));
  });

  element.onchange = () => onChange(element);

  return element;
}

/**
 *
 * @param dropDowns
 */
export function createDropDownBox(dropDowns) {
  const boxDiv = document.createElement('div');
  boxDiv.className = 'dropdown-container';
  dropDowns.forEach((val) => {
    boxDiv.appendChild(val);
  });

  return boxDiv;
}

// Design note: I used to pass async functions / promises around - ive now used modules instead!
