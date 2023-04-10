"use strict"

var currentDragged = null;

function shouldInsertAbove(d, e) {
    let rec = d.getBoundingClientRect();
    if (e.pageY < rec.top + rec.height/2) {
        return true;
    }
    return false
}

// every time an element is added to the playlist, call this on it
// adapted from W.S. Toh's post at https://code-boxx.com/drag-drop-sortable-list-javascript/
function makeSortable(el) {
    el.draggable = true;

    el.ondragstart = (e) => {
        currentDragged = el;
        movingLibraryTrack = false;
        updateOverlays();
    };

    el.ondragenter = (e) => {
        el.classList.add("insert");
    };

    el.ondragleave = (e) => {
        el.classList.remove("insert");
        el.classList.remove("above");
        el.classList.remove("below");
    };

    el.ondragover = (e) => {
        e.preventDefault()
        el.classList.add("insert");
        if (shouldInsertAbove(el, e)) {
            el.classList.add("above");
            el.classList.remove("below");
        } else {
            el.classList.add("below");
            el.classList.remove("above");
        }
    };

    el.ondrop = (e) => {
        e.preventDefault();
        el.classList.remove("insert");
        el.classList.remove("above");
        el.classList.remove("below");

        if (shouldInsertAbove(el, e)) {
            el.insertAdjacentElement('beforebegin', currentDragged);
        } else {
            el.insertAdjacentElement('afterend', currentDragged);
        }
        currentDragged = null;
        updateOverlays();
    };
}
