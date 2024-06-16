import { createButton, createDivContainer, createTextElem, createInput, createLabel } from './DOMElementCreationMethods.js';
import { format } from "date-fns";

export default function updateChecklistsDOM(project) {
    const checklistsList = document.getElementById('checklists-list');
    checklistsList.replaceChildren();

    project.checklists.forEach((checklist) => {
        const checklistWrapper = document.createElement('li');
        checklistWrapper.classList.add('checklist-item');
        checklistsList.appendChild(checklistWrapper);
        
        const checklistCompletionCheckbox = createInput('checkbox', '', '', '', '', checklistWrapper);
        checklistCompletionCheckbox.classList.add('completion-checkbox');
        if (checklist.completed) checklistCompletionCheckbox.checked = true;
        createTextElem('h4', checklist.title, checklistWrapper);
        let dueDate;
        if (checklist.dueDate) {
            dueDate = format(checklist.dueDate, 'MM/dd/yyyy');
        } else if (!checklist.dueDate) {
            dueDate = "N/A";
        }
        createTextElem('p', `Due date: ${dueDate}`, checklistWrapper);
    
        const editChecklistContainer = createDivContainer('modal-container', '', checklistWrapper);
        editChecklistContainer.classList.add('edit-checklist-modal');
        const openEditChecklistModal = createButton('View/Edit', 'open-modal-button', '', editChecklistContainer);
        const editChecklistModal = document.createElement('dialog');
        editChecklistContainer.appendChild(editChecklistModal);
        const editChecklistForm = document.createElement('form');
        editChecklistForm.method = 'dialog';
        createLabel('editChecklistTitle', 'Checklist title', editChecklistForm);
        const editChecklistTitleInput = createInput('text', 'editChecklistTitle', 'editChecklistTitle', true, '', editChecklistForm);
    
        createLabel('editChecklistDueDate', 'Due date: ', editChecklistForm);
        const editChecklistDuedateInput = createInput('date', 'editChecklistDueDate', 'editChecklistDueDate', true, '', editChecklistForm);
        const cancelEditBtn = createButton('Cancel', 'cancel-button', '', editChecklistForm);
        cancelEditBtn.type = 'button';
        const editChecklistBtn = createButton('Confirm', 'submit-button', '', editChecklistForm);
        editChecklistModal.appendChild(editChecklistForm);
        const editChecklistInputsArr = document.querySelectorAll('.edit-checklist-modal input');
    
        const checklistRemoveContainer = createDivContainer('modal-container', '', checklistWrapper);
        checklistRemoveContainer.classList.add('remove-checklist-modal');
        const openChecklistRemoveModal = createButton('x', 'open-modal-button', '', checklistRemoveContainer);
        const checklistRemoveModal = document.createElement('dialog');
        checklistRemoveContainer.appendChild(checklistRemoveModal);
        createTextElem('p', 'Are you sure you want to delete this checklist?', checklistRemoveModal);
        const cancelChecklistRemoveBtn = createButton('Cancel', 'cancel-button', '', checklistRemoveModal);
        const removeChecklistBtn = createButton('Confirm', 'submit-button', '', checklistRemoveModal);
    
        const removeChecklistBtnHandler = () => {
            project.removeItem('checklists', checklist);
            updateChecklistsDOM(project, 'checklists-list');
        };
    
        const editChecklistBtnHandler = () => {
            if (!editChecklistForm.checkValidity()) return;
    
            project.editChecklist(checklist, editChecklistTitleInput.value, editChecklistDuedateInput.value);
            updateChecklistsDOM(project, 'checklists-list');
        };

        const editChecklistInputsClickHandler = (e) => {
            e.target.readOnly = false;
        };

        const editChecklistInputsFocusOutHandler = (e) => {
            e.target.readOnly = true;
        }
            
        editChecklistInputsArr.forEach(input => {
            input.readOnly = true;
            input.addEventListener('click', editChecklistInputsClickHandler);
            input.addEventListener('focusout', editChecklistInputsFocusOutHandler);
        });
    
        const checklistCompletionCheckboxHandler = () => {
            if (checklistCompletionCheckbox.checked) checklist.completed = true;
            if (!checklistCompletionCheckbox.checked) checklist.completed = false;
        };
    
        checklistCompletionCheckbox.addEventListener('click', checklistCompletionCheckboxHandler);
    
        editChecklistBtn.addEventListener('click', editChecklistBtnHandler);
    
        editChecklistForm.addEventListener('submit', (e) => {
            editChecklistTitleInput.removeAttribute('required');
            editChecklistForm.reset();
            setTimeout(() => {
                editChecklistTitleInput.setAttribute('required', '');
            }, 100);
        });
    
        openEditChecklistModal.addEventListener('click', () => {
            editChecklistTitleInput.value = checklist.title;
            editChecklistDuedateInput.value = checklist.dueDate;
            editChecklistModal.showModal();
        });
    
        cancelEditBtn.addEventListener('click', () => editChecklistModal.close());
    
        openChecklistRemoveModal.addEventListener('click', () => checklistRemoveModal.showModal());
    
        removeChecklistBtn.addEventListener('click', removeChecklistBtnHandler);
    
        cancelChecklistRemoveBtn.addEventListener('click', () => checklistRemoveModal.close());
    });
}