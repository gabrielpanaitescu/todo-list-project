import { createTextElem, createDivContainer, createButton, createLabel, createInput  } from './DOMElementCreationMethods.js';
import { projectsManager } from './createProject.js';

export default function updateNotesDOM(project, appendToID) {
    const notesList = document.getElementById(appendToID);
    notesList.replaceChildren();

    project.notes.forEach((note) => {
        const noteWrapper = document.createElement('li');
        noteWrapper.classList.add('note-item');
        notesList.appendChild(noteWrapper);

        createTextElem('h4', note.title, noteWrapper);
        createTextElem('p', note.description, noteWrapper);

        const viewNoteContainer = createDivContainer('modal-container', '', noteWrapper);
        viewNoteContainer.classList.add('view-note-modal');
        const openViewNoteModal = createButton('View details', 'open-modal-button', '', viewNoteContainer);
        const viewNoteModal = document.createElement('dialog');
        viewNoteContainer.appendChild(viewNoteModal);
        createTextElem('p', 'Title: ' + note.title, viewNoteModal);
        createTextElem('p', 'Description: ' + note.description, viewNoteModal);
        const closeViewNoteModalBtn = createButton('Close', 'cancel-button', '', viewNoteModal);

        const editNoteContainer = createDivContainer('modal-container', '', noteWrapper);
        editNoteContainer.classList.add('edit-note-modal');
        const openEditNoteModal = createButton('Edit note', 'open-modal-button', '', editNoteContainer);
        const editNoteModal = document.createElement('dialog');
        editNoteContainer.appendChild(editNoteModal);
        const editNoteForm = document.createElement('form');
        editNoteForm.method = 'dialog';
        createLabel('editNoteTitle', 'Note title', editNoteForm);
        const editNoteTitleInput = createInput('text', 'editNoteTitle', 'editNoteTitle', true, 3, editNoteForm);
        createLabel('editNoteDescription', 'Note description', editNoteForm);
        const editNoteDescriptionInput = createInput('textarea', 'editNoteDescription', 'editNoteDescription', true, '', editNoteForm);
        const cancelEditBtn = createButton('Cancel', 'cancel-button', '', editNoteForm);
        cancelEditBtn.type = 'button';
        const editNoteBtn = createButton('Confirm', 'submit-button', '', editNoteForm);
        editNoteModal.appendChild(editNoteForm);

        const noteRemoveContainer = createDivContainer('modal-container', '', noteWrapper);
        noteRemoveContainer.classList.add('remove-note-modal');
        const openNoteRemoveModal = createButton('x', 'open-modal-button', '', noteRemoveContainer);
        const noteRemoveModal = document.createElement('dialog');
        noteRemoveContainer.appendChild(noteRemoveModal);
        createTextElem('p', 'Are you sure you want to delete this note?', noteRemoveModal);
        const cancelNoteRemoveBtn = createButton('Cancel', 'cancel-button', '', noteRemoveModal);
        const removeNoteBtn = createButton('Confirm', 'submit-button', '', noteRemoveModal);

        const removeNoteBtnHandler = () => {
            project.removeItem('notes', note);
            updateNotesDOM(project, 'notes-list');
        };

        const editNoteBtnHandler = () => {
            if (!editNoteTitleInput.validity.valid || !editNoteDescriptionInput.validity.valid) return;
            
            project.editNote(note, editNoteTitleInput.value, editNoteDescriptionInput.value);
            updateNotesDOM(project, 'notes-list');
        };

        editNoteBtn.addEventListener('click', editNoteBtnHandler);

        editNoteForm.addEventListener('submit', (e) => {
            editNoteTitleInput.removeAttribute('required');
            editNoteDescriptionInput.removeAttribute('required');
            editNoteForm.reset();
            setTimeout(() => {
                editNoteTitleInput.setAttribute('required', '');
                editNoteDescriptionInput.setAttribute('required', '');
            }, 100);
          });

        openEditNoteModal.addEventListener('click', () => {
            editNoteTitleInput.value = note.title;
            editNoteDescriptionInput.value = note.description;
            editNoteModal.showModal();
        });

        cancelEditBtn.addEventListener('click', () => editNoteModal.close());

        openViewNoteModal.addEventListener('click', () => viewNoteModal.showModal());

        closeViewNoteModalBtn.addEventListener('click', () => viewNoteModal.close());

        openNoteRemoveModal.addEventListener('click', () => noteRemoveModal.showModal());

        removeNoteBtn.addEventListener('click', removeNoteBtnHandler);

        cancelNoteRemoveBtn.addEventListener('click', () => noteRemoveModal.close());
    });
}