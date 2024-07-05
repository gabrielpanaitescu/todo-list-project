import { createTextElem, createDivContainer, createButton, createLabel, createInput, createTextarea } from './DOMElementCreationMethods';
import { projectsManager } from './projectsManager';


export default function updateNotesDOM(project, IDtoAppend) {
    const notesList = document.getElementById(IDtoAppend);
    notesList.replaceChildren();

    if (project.notes.length < 1) {
        createTextElem('h4', 'No notes found', notesList);
        return;
    }

    project.notes.forEach((note) => {
        const noteWrapper = document.createElement('li');
        noteWrapper.classList.add('note-item');
        notesList.appendChild(noteWrapper);

        createTextElem('h4', 'Title: ' + note.title, noteWrapper);
        createTextElem('p', 'Description: ' + note.description, noteWrapper);
  
        const editNoteContainer = createDivContainer('modal-container', '', noteWrapper);
        editNoteContainer.classList.add('edit-note-modal');
        editNoteContainer.classList.add('edit-item-container');
        const openEditNoteModal = createButton('Expand', 'open-modal-button', '', editNoteContainer);
        openEditNoteModal.classList.add('expand-button');
        const editNoteModal = document.createElement('dialog');
        editNoteContainer.appendChild(editNoteModal);
        const editNoteForm = document.createElement('form');
        editNoteForm.method = 'dialog';
        createLabel('editNoteTitle', 'Note title    ', editNoteForm);
        const editNoteTitleInput = createInput('text', 'editNoteTitle', 'editNoteTitle', true, '', editNoteForm);
        createLabel('editNoteDescription', 'Note description', editNoteForm);

        const editNoteDescriptionInput = createTextarea('editNoteDescription', 'editNoteDescription', true, 3, '', '', editNoteForm);

        const cancelEditBtn = createButton('Cancel', 'cancel-button', '', editNoteForm);
        cancelEditBtn.type = 'button';
        const editNoteBtn = createButton('Save and close', 'submit-button', '', editNoteForm);
        editNoteModal.appendChild(editNoteForm);
        let editNoteInputsArr = editNoteForm.querySelectorAll('input, textarea');

        const moveNoteContainer = createDivContainer('move-item-container', '', noteWrapper);
        const moveNoteSelect = document.createElement('select');
        moveNoteSelect.classList.add('move-item');
        moveNoteSelect.id = 'move-note';
        moveNoteContainer.appendChild(moveNoteSelect);
        projectsManager.projectsArr.forEach((projectObj, index) => {
            const moveNoteOption = document.createElement('option');
            moveNoteOption.value = projectObj.title;
            const originProject = projectsManager.findOriginProject('notes', note);
            if (originProject.title === projectObj.title) moveNoteOption.setAttribute('selected', '');
            if (moveNoteOption.selected) moveNoteOption.setAttribute('disabled', '');
            moveNoteOption.dataset.projectIndex = index;
            moveNoteOption.textContent = projectObj.title; 
            moveNoteSelect.appendChild(moveNoteOption);
        });

        const noteRemoveContainer = createDivContainer('modal-container', '', noteWrapper);
        noteRemoveContainer.classList.add('remove-item-modal-container');
        const openNoteRemoveModal = createButton('x', 'open-modal-button', '', noteRemoveContainer);
        openNoteRemoveModal.classList.add('remove-item-button');
        const noteRemoveModal = document.createElement('dialog');
        noteRemoveContainer.appendChild(noteRemoveModal);
        createTextElem('p', 'Are you sure you want to delete this note?', noteRemoveModal);
        const cancelNoteRemoveBtn = createButton('Cancel', 'cancel-button', '', noteRemoveModal);
        const removeNoteBtn = createButton('Confirm', 'submit-button', '', noteRemoveModal);

        const removeNoteBtnHandler = () => {
            projectsManager.removeItemFromProject('notes', note);
            updateNotesDOM(project, IDtoAppend);
        };

        const moveNoteHandler = (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            projectsManager.moveItemToProject('notes', note, selectedOption.dataset.projectIndex);
            updateNotesDOM(project, IDtoAppend);
        };

        const editNoteBtnHandler = () => {
            editNoteInputsArr.forEach(input => input.readOnly = false);

            if (!editNoteForm.checkValidity()) return;
            
            project.editNote(note, editNoteTitleInput.value, editNoteDescriptionInput.value);
            updateNotesDOM(project, IDtoAppend);
        };

        const editNoteInputsToReadWrite = (e) => {
            e.target.readOnly = false;
        };

        const editNoteInputsToReadOnly = (e) => {
            e.target.readOnly = true;
        }

        editNoteInputsArr.forEach(input => {
            input.readOnly = true;
            input.addEventListener('click', editNoteInputsToReadWrite);
            input.addEventListener('focusout', editNoteInputsToReadOnly);
        });

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

        moveNoteSelect.addEventListener('change', moveNoteHandler);

        cancelEditBtn.addEventListener('click', () => editNoteModal.close());

        openNoteRemoveModal.addEventListener('click', () => noteRemoveModal.showModal());

        removeNoteBtn.addEventListener('click', removeNoteBtnHandler);

        cancelNoteRemoveBtn.addEventListener('click', () => noteRemoveModal.close());
    });
}