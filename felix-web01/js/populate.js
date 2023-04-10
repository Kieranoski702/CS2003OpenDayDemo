"use strict"

const playlist = document.getElementById('playlist');
const plInfo = document.getElementById("pl-info");


// image uploaded by SVG Repo to https://www.svgrepo.com/svg/56237/add
const addSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 42 42" style="enable-background:new 0 0 42 42;" xml:space="preserve"><path d="M37.059,16H26V4.941C26,2.224,23.718,0,21,0s-5,2.224-5,4.941V16H4.941C2.224,16,0,18.282,0,21s2.224,5,4.941,5H16v11.059  C16,39.776,18.282,42,21,42s5-2.224,5-4.941V26h11.059C39.776,26,42,23.718,42,21S39.776,16,37.059,16z"/></svg>'

// image uploaded by SVG Repo to https://www.svgrepo.com/svg/105737/play-button
const playSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve"><path id="XMLID_308_" d="M37.728,328.12c2.266,1.256,4.77,1.88,7.272,1.88c2.763,0,5.522-0.763,7.95-2.28l240-149.999  c4.386-2.741,7.05-7.548,7.05-12.72c0-5.172-2.664-9.979-7.05-12.72L52.95,2.28c-4.625-2.891-10.453-3.043-15.222-0.4  C32.959,4.524,30,9.547,30,15v300C30,320.453,32.959,325.476,37.728,328.12z"/></svg>'


function formatSec(rs) {
    rs = Math.round(rs);
    let s = rs % 60; // formatted seconds
    let m = Math.floor((rs/60)%60);
    let h = Math.floor(rs/3600);
    
    if (s < 10) s = "0" + s;
    if (h) {
        if (m < 10) m = "0" + m;
        if (h < 10) h = "0" + h;
        return h + ":" + m + ":" + s;
    }
    return m + ":" + s;
}

function formatMS(ms) {
    let rs = Math.round(ms/1000); // raw seconds
    return formatSec(rs);
}

function makeDiv(classStr, inner) {
    let elmt = document.createElement("div");
    elmt.setAttribute("class", classStr);
    if (inner) elmt.innerHTML = inner;
    return elmt; 
}

// take a track object and return a base HTML element
function makeTrack(t) {
    let elmt = makeDiv("track");
    elmt.track = t;
    elmt.setAttribute("data-trackid", t.id);

    let playBtn = makeDiv("btn play", playSVG);
    playBtn.onclick = () => {
        play(t);
    }
    elmt.appendChild(playBtn)

    let info = makeDiv("info");

    let name = makeDiv("name", t.song);
    let details = makeDiv("details", t.album + " • " + t.year);
    info.appendChild(name);
    info.appendChild(details);

    elmt.appendChild(info);

    let dur = makeDiv("dur", formatMS(t.duration_ms));
    elmt.appendChild(dur);

    return elmt
}

function makePlaylistTrack(t) {
    let elmt = makeTrack(t);
    let rmBtn = makeDiv("btn left", addSVG);
    rmBtn.onclick = () => {
        playlist.removeChild(elmt);
        removeTrack(t);
    }
    elmt.appendChild(rmBtn);
    makeSortable(elmt, t);

    return elmt;
}

function makeLibraryTrack(t) {
    let elmt = makeTrack(t);
    let addBtn = makeDiv("btn left", addSVG); // the svg is rotated 45 deg later to make an X
    addBtn.onclick = () => {
        let nt = makePlaylistTrack(t);
        playlist.appendChild(nt);
        addTrack(t);
    }
    elmt.appendChild(addBtn);
    makeFetchable(elmt);

    return elmt;
}