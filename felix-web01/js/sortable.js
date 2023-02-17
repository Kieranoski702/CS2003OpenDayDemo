"use strict"

var current = null;

function shouldInsertAbove(d, e) {
    let rec = d.getBoundingClientRect();
    if (e.pageY < rec.top + rec.height/2) {
        return true;
    }
    return false
}

// every time an element is added to the playlist, call this on it
// adapted from W.S. Toh's post at https://code-boxx.com/drag-drop-sortable-list-javascript/
function makeSortable(t) {
    t.draggable = true;

    t.ondragstart = (e) => {
        current = t;
    };

    t.ondragenter = (e) => {
        t.classList.add("insert");
    };

    t.ondragleave = (e) => {
        t.classList.remove("insert");
        t.classList.remove("above");
        t.classList.remove("below");
    };

    t.ondragover = (e) => {
        e.preventDefault()
        t.classList.add("insert");
        if (shouldInsertAbove(t, e)) {
            t.classList.add("above");
            t.classList.remove("below");
        } else {
            t.classList.add("below");
            t.classList.remove("above");
        }
    };

    t.ondrop = (e) => {
        e.preventDefault();
        t.classList.remove("insert");
        t.classList.remove("above");
        t.classList.remove("below");

        if (shouldInsertAbove(t, e)) {
            t.insertAdjacentElement('beforebegin', current);
        } else {
            t.insertAdjacentElement('afterend', current);
        }
    };
}
