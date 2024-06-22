import { createButton, createDivContainer, createTextElem, createInput, createLabel } from './DOMElementCreationMethods.js';
import { format } from "date-fns";
import { createListItem } from './createProject.js';
import { projectsManager } from './createProject.js';

export default function updateChecklistsDOM(project, appendToID) {
    const checklistsList = document.getElementById(appendToID);
    checklistsList.replaceChildren();

    if (project.checklists.length < 1) {
        createTextElem('h4', 'No checklists found', checklistsList);
        return;
    }

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
        editChecklistContainer.classList.add('edit-container');
        const openEditChecklistModal = createButton('View/Edit', 'open-modal-button', '', editChecklistContainer);
        const editChecklistModal = document.createElement('dialog');
        editChecklistContainer.appendChild(editChecklistModal);
        const editChecklistForm = document.createElement('form');
        editChecklistForm.method = 'dialog';
        createLabel('editChecklistTitle', 'Checklist title', editChecklistForm);
        const editChecklistTitleInput = createInput('text', 'editChecklistTitle', 'editChecklistTitle', true, '', editChecklistForm);
        editChecklistTitleInput.classList.add('edit-checklist-input');
        createLabel('editChecklistDueDate', 'Due date (Optional)', editChecklistForm);
        const editChecklistDuedateInput = createInput('date', 'editChecklistDueDate', 'editChecklistDueDate', '', '', editChecklistForm);
        editChecklistDuedateInput.classList.add('edit-checklist-input');

        const listEditItemsFieldset = document.createElement('fieldset');
        listEditItemsFieldset.classList.add('list-items-fieldset');
        editChecklistForm.appendChild(listEditItemsFieldset);
        const listItemsLegend = document.createElement('legend');
        listItemsLegend.textContent = 'Checklist items';
        listEditItemsFieldset.appendChild(listItemsLegend);
        const createListItemInputBtn = createButton('+', '', 'create-list-edit-item-button', listEditItemsFieldset);
        createListItemInputBtn.type = 'button';
        createLabel('create-list-edit-item-button', 'Press here to add new a new checklist item', listEditItemsFieldset);
        const listItemsContainer = createDivContainer('list-items-container', '', listEditItemsFieldset);
        // const emptyListItemsContainerMessage = createTextElem('p', 'No items currently added.', listEditItemsFieldset);

        const cancelEditBtn = createButton('Cancel', 'cancel-button', '', editChecklistForm);
        cancelEditBtn.type = 'button';
        const editChecklistBtn = createButton('Confirm', 'submit-button', '', editChecklistForm);
        editChecklistModal.appendChild(editChecklistForm);
        let editChecklistInputsHTMLCollection = editChecklistForm.getElementsByClassName('edit-checklist-input');
    
        const checklistRemoveContainer = createDivContainer('modal-container', '', checklistWrapper);
        checklistRemoveContainer.classList.add('remove-checklist-modal');
        const openChecklistRemoveModal = createButton('x', 'open-modal-button', '', checklistRemoveContainer);
        const checklistRemoveModal = document.createElement('dialog');
        checklistRemoveContainer.appendChild(checklistRemoveModal);
        createTextElem('p', 'Are you sure you want to delete this checklist?', checklistRemoveModal);
        const cancelChecklistRemoveBtn = createButton('Cancel', 'cancel-button', '', checklistRemoveModal);
        const removeChecklistBtn = createButton('Confirm', 'submit-button', '', checklistRemoveModal);
    
        const removeChecklistBtnHandler = () => {
            projectsManager.removeItemFromProject('checklists', checklist);
            updateChecklistsDOM(project, appendToID);
        };
    
        const editChecklistBtnHandler = () => {
            Array.from(editChecklistInputsHTMLCollection).forEach(input => input.readOnly = false);

            if (!editChecklistForm.checkValidity()) return;

            // const editListItemsValuesArray = Array.from(listItemsContainer.getElementsByClassName('edit-list-item-input')).map(input => input.value);

            const editedListItemsArr = 
                    Array.from(document.querySelectorAll('.list-item-row'))
                    .map(row => Array.from(row.children))
                    .map(array => {
                        const textInput = array.filter(item => item.type === 'text')[0];
                        const checkboxInput = array.filter(item => item.type === 'checkbox')[0];
                        console.log(textInput);

                        return createListItem(textInput.value, checkboxInput.checked);
            });

            console.log(editedListItemsArr);

            project.editChecklist(checklist, editChecklistTitleInput.value, editChecklistDuedateInput.value, editedListItemsArr);
            
            updateChecklistsDOM(project, appendToID);
        };

        const editChecklistInputsClickHandler = (e) => {
            e.target.readOnly = false;
        };

        const editChecklistInputsFocusOutHandler = (e) => {
            e.target.readOnly = true;
        }

        const checklistCompletionCheckboxHandler = () => {
            if (checklistCompletionCheckbox.checked) checklist.completed = true;
            if (!checklistCompletionCheckbox.checked) checklist.completed = false;
        };

        const addClickAndFocusEvents = () => {
            Array.from(editChecklistInputsHTMLCollection).forEach(input => {
                input.readOnly = true;
                input.addEventListener('click', editChecklistInputsClickHandler);
                input.addEventListener('focusout', editChecklistInputsFocusOutHandler);
            });
        }

        addClickAndFocusEvents();        

        const createListItemInputRow = (listItem) => {
            const listItemRowContainer = createDivContainer('list-item-row', '', listItemsContainer)
            const listItemCompletionCheckbox = createInput('checkbox', '', '', '' ,'', listItemRowContainer);
            listItemCompletionCheckbox.classList.add('list-item-completion-checkbox');
            if (listItem && listItem.completed) listItemCompletionCheckbox.checked = true;

            // ghost label for CSS edit icon pseudo element selector
            createLabel('', '', listItemRowContainer);

            const listItemInput = createInput('text', '', '', true, '', listItemRowContainer);
            listItemInput.classList.add('edit-checklist-input', 'edit-list-item-input');

            if (listItem) listItemInput.value = listItem.title;

            addClickAndFocusEvents();  

            listItemInput.focus();
            listItemInput.readOnly = false;

            const removeContainerBtn = createButton('x', '', '', listItemRowContainer);
            removeContainerBtn.classList.add('remove-item-button');
            removeContainerBtn.type = 'button';

            removeContainerBtn.addEventListener('click', () => {
                listItemRowContainer.parentElement.removeChild(listItemRowContainer);
                // if (listItemsContainer.children.length < 1) emptyListItemsContainerMessage.style.display = 'block';
            });
            // if (listItemsContainer.children.length >= 1) emptyListItemsContainerMessage.style.display = 'none';
        };

        const updateListItems = () => {
            listItemsContainer.replaceChildren();

            // if (listItemsContainer.children.length < 1) emptyListItemsContainerMessage.style.display = 'block';

            if (checklist.listItems.length >= 1) checklist.listItems.forEach(listItem => {
                createListItemInputRow(listItem);
            });
        };

        createListItemInputBtn.addEventListener('click', () => {
            createListItemInputRow();
        });
    
        checklistCompletionCheckbox.addEventListener('click', checklistCompletionCheckboxHandler);
    
        editChecklistBtn.addEventListener('click', editChecklistBtnHandler);
    
        editChecklistForm.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {

              const isAListItemFocused = Array.from(listItemsContainer.getElementsByClassName('edit-list-item-input')).find(item => item === document.activeElement);

              if (isAListItemFocused && !isAListItemFocused.readOnly) {
                event.preventDefault();  // Prevent the default form submission
                createListItemInputRow();
              }
            }
          });

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

            updateListItems();

            editChecklistModal.showModal();
        });
    
        cancelEditBtn.addEventListener('click', () => editChecklistModal.close());
    
        openChecklistRemoveModal.addEventListener('click', () => checklistRemoveModal.showModal());
    
        removeChecklistBtn.addEventListener('click', removeChecklistBtnHandler);
    
        cancelChecklistRemoveBtn.addEventListener('click', () => checklistRemoveModal.close());
    });
}