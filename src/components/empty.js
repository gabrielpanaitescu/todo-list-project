const checklistCreateContainer = createDivContainer('create-checklists', '', checklistsContainer);
checklistCreateContainer.classList.add('modal-container');
const openChecklistCreateModal = createButton('Add checklist', 'open-modal-button', '', checklistCreateContainer);
const checklistCreateModal = document.createElement('dialog');
checklistCreateContainer.appendChild(checklistCreateModal);

const addChecklistForm = document.createElement('form');
addChecklistForm.method = 'dialog';
createLabel('checklistTitle', 'Checklist title', addChecklistForm); 
const checklistTitleInput = createInput('text', 'checklistTitle', 'checklistTitle', true, 3, addChecklistForm);

createLabel('checklistDueDate', 'Due date: ', addChecklistForm);
const checklistDuedateInput = createInput('date', 'checklistDueDate', 'checklistDueDate', true, '', addChecklistForm);

const cancelBtn = createButton('Cancel', 'cancel-button', '', addChecklistForm);
cancelBtn.type = 'button';
const createChecklistBtn = createButton('Confirm', 'submit-button', '', addChecklistForm);
checklistCreateModal.appendChild(addChecklistForm);

const checklistsList = document.createElement('ul');
checklistsList.id = 'checklists-list';
checklistsContainer.appendChild(checklistsList);

const createChecklistBtnHandler = (project) => {
    if (!checklistTitleInput.validity.valid || !checklistDuedateInput.validity.valid) return;

    project.addChecklist(createChecklist(checklistTitleInput.value, checklistDuedateInput.value, false));
    updateChecklistsDOM(project, 'checklists-list');
}

createChecklistBtn.addEventListener('click', () => {
    createChecklistBtnHandler(project);
});

openChecklistCreateModal.addEventListener('click', () => {
    checklistCreateModal.showModal();
});

cancelBtn.addEventListener('click', () => {
    checklistCreateModal.close();
});

addChecklistForm.addEventListener('submit', (e) => {
    checklistTitleInput.removeAttribute('required');
    checklistDuedateInput.removeAttribute('required');
    addChecklistForm.reset();
    setTimeout(() => {
        checklistTitleInput.setAttribute('required', '');
        checklistDuedateInput.setAttribute('required', '');
    }, 100);
  });