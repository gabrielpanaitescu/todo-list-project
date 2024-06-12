import { createButton, createDivContainer, createTextElem } from './DOMElementCreationMethods.js';

export default function updateNotesDOM(notes, appendToID) {
    const notesList = document.getElementById(appendToID);
    notesList.replaceChildren();

    notes.forEach((note, index) => {
        const noteWrapper = createDivContainer('note-wrapper', '', notesList);
        createTextElem('h4', note.title, noteWrapper);
        createTextElem('p', note.description, noteWrapper);

        const deleteNoteBtn = createButton('Delete note', 'delete-btn', '', notesList);
        deleteNoteBtn.dataset.index = index;

        const deleteNoteBtnHandler = () => {
            notes = notes.filter(elem => elem !== note);
            console.log(notes);
            updateNotesDOM(notes, 'notes-list');
        };

        deleteNoteBtn.addEventListener('click', deleteNoteBtnHandler);
    });
}