import { projectsManager, createProject, createNote, createTask, createChecklist, createListItem } from './createProject.js';
import { createButton, createDivContainer, createTextElem, createLabel, createInput, createImportanceSelectElem } from './DOMElementCreationMethods.js';
import nav from './nav.js';
import { clearMain, renderDefaultProject } from './manageDOM.js';
import updateTasksDOM from './tasksDOMList.js';
import updateNotesDOM from './notesDOMList.js';
import updateChecklistsDOM from './checklistsDOMList.js';

export default function createProjectDOMContainer(project) {
    const projectContainer = createDivContainer('', 'project-container', '');
    
    createTextElem('h2', project.title, projectContainer);

    projectContainer.appendChild(createNotesContainer(project));
    projectContainer.appendChild(createTasksContainer(project));
    projectContainer.appendChild(createChecklistsContainer(project));

    const createRemoveProjectBtn = () => {
        const removeProjectModalContainer = createDivContainer('project-remove', '', projectContainer);
        removeProjectModalContainer.classList.add('modal-container');
        const openProjectRemoveModal = createButton('x', 'open-modal-button', '', removeProjectModalContainer);
        const projectRemoveModal = document.createElement('dialog');
        createTextElem('p', 'Are you sure you want to delete this project?', projectRemoveModal);
        const cancelBtn = createButton('Cancel', 'cancel-button', '', projectRemoveModal);
        const removeProjectBtn = createButton('Confirm', 'submit-button', '', projectRemoveModal);
        removeProjectModalContainer.appendChild(projectRemoveModal);

        const removeProjectBtnHandler = (project) => {
            projectsManager.deleteProject(project);
            nav.renderNav();
            renderDefaultProject();
            // or clearMain();
        }
        
        openProjectRemoveModal.addEventListener('click', () => projectRemoveModal.showModal());

        cancelBtn.addEventListener('click', () => projectRemoveModal.close());

        removeProjectBtn.addEventListener('click', () => {
            removeProjectBtnHandler(project);
        });
    };

    if (project.title !== 'Personal') {
        createRemoveProjectBtn();
    };

    return projectContainer;
}

function createNotesContainer(project) {
    const notesContainer = document.createElement('div');
    notesContainer.classList.add('notes-container', 'sub-project-container');
    createTextElem('h3', 'Notes', notesContainer);
    const noteCreateContainer = createDivContainer('create-notes', '', notesContainer);
    noteCreateContainer.classList.add('modal-container');
    const openNoteCreateModal = createButton('Add note', 'open-modal-button', '', noteCreateContainer);
    const noteCreateModal = document.createElement('dialog');
    noteCreateContainer.appendChild(noteCreateModal);

    const addNoteForm = document.createElement('form');
    addNoteForm.method = 'dialog';
    createLabel('noteTitle', 'Note title', addNoteForm);
    const noteTitleInput = createInput('text', 'noteTitle', 'noteTitle', true, '', addNoteForm);
    createLabel('noteDescription', 'Note description', addNoteForm);
    const noteDescriptionInput = createInput('textarea', 'noteDescription', 'noteDescription', true, '', addNoteForm);
    const cancelBtn = createButton('Cancel', 'cancel-button', '', addNoteForm);
    cancelBtn.type = 'button';
    const createNoteBtn = createButton('Confirm', 'submit-button', '', addNoteForm);
    noteCreateModal.appendChild(addNoteForm);

    const notesList = document.createElement('ul');
    notesList.id = 'notes-list';
    notesContainer.appendChild(notesList);

    const createNoteBtnHandler = (project) => {
        if (!addNoteForm.checkValidity()) return;
        project.addNote(createNote(noteTitleInput.value, noteDescriptionInput.value));
        updateNotesDOM(project, 'notes-list');
    };

    createNoteBtn.addEventListener('click', () => {
        createNoteBtnHandler(project);
    });

    openNoteCreateModal.addEventListener('click', () => {
        noteCreateModal.showModal();
    });

    cancelBtn.addEventListener('click', () => {
        noteCreateModal.close();
    });

    addNoteForm.addEventListener('submit', (e) => {
        noteTitleInput.removeAttribute('required');
        noteDescriptionInput.removeAttribute('required');
        addNoteForm.reset();
        setTimeout(() => {
            noteTitleInput.setAttribute('required', '');
            noteDescriptionInput.setAttribute('required', '');
        }, 100);
      });

    return notesContainer;
}

function createTasksContainer(project) {
    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasks-container', 'sub-project-container');
    createTextElem('h3', 'Tasks', tasksContainer);
    const taskCreateContainer = createDivContainer('create-tasks', '', tasksContainer);
    taskCreateContainer.classList.add('modal-container');
    const openTaskCreateModal = createButton('Add task', 'open-modal-button', '', taskCreateContainer);
    const taskCreateModal = document.createElement('dialog');
    taskCreateContainer.appendChild(taskCreateModal);

    const addTaskForm = document.createElement('form');
    addTaskForm.method = 'dialog';
    createLabel('taskTitle', 'Task title', addTaskForm); 
    const taskTitleInput = createInput('text', 'taskTitle', 'taskTitle', true, '', addTaskForm);
    createLabel('taskDescription', 'Task description', addTaskForm);
    const taskDescriptionInput = createInput('textarea', 'taskDescription', 'taskDescription', true, '', addTaskForm);
    createLabel('taskImportance', 'Importance', addTaskForm);
    const taskImportanceSelect = createImportanceSelectElem('task', addTaskForm);
    createLabel('taskDueDate', 'Due date: ', addTaskForm);
    const taskDuedateInput = createInput('date', 'taskDueDate', 'taskDueDate', true, '', addTaskForm);
    const cancelBtn = createButton('Cancel', 'cancel-button', '', addTaskForm);
    cancelBtn.type = 'button';
    const createTaskBtn = createButton('Confirm', 'submit-button', '', addTaskForm);
    taskCreateModal.appendChild(addTaskForm);

    const tasksList = document.createElement('ul');
    tasksList.id = 'tasks-list';
    tasksContainer.appendChild(tasksList);

    const createTaskBtnHandler = (project) => {
        if (!addTaskForm.checkValidity()) return;

        project.addTask(createTask(taskTitleInput.value, taskDescriptionInput.value, taskImportanceSelect.value, taskDuedateInput.value));
        updateTasksDOM(project, 'tasks-list');
    }

    createTaskBtn.addEventListener('click', () => {
        createTaskBtnHandler(project);
    });

    openTaskCreateModal.addEventListener('click', () => {
        taskCreateModal.showModal();
    });

    cancelBtn.addEventListener('click', () => {
        taskCreateModal.close();
    });

    addTaskForm.addEventListener('submit', (e) => {
        taskTitleInput.removeAttribute('required');
        taskDescriptionInput.removeAttribute('required');
        taskDuedateInput.removeAttribute('required');
        addTaskForm.reset();
        setTimeout(() => {
            taskTitleInput.setAttribute('required', '');
            taskDescriptionInput.setAttribute('required', '');
            taskDuedateInput.setAttribute('required', '');
        }, 100);
      });

    return tasksContainer;
}

function createChecklistsContainer(project) {
    const checklistsContainer = document.createElement('div');
    checklistsContainer.classList.add('checklists-container', 'sub-project-container');
    createTextElem('h3', 'Checklists', checklistsContainer);
    const checklistCreateContainer = createDivContainer('create-checklists', '', checklistsContainer);
    checklistCreateContainer.classList.add('modal-container');
    const openChecklistCreateModal = createButton('Add checklist', 'open-modal-button', '', checklistCreateContainer);
    const checklistCreateModal = document.createElement('dialog');
    checklistCreateContainer.appendChild(checklistCreateModal);

    const addChecklistForm = document.createElement('form');
    addChecklistForm.method = 'dialog';
    createLabel('checklistTitle', 'Checklist title', addChecklistForm); 
    const checklistTitleInput = createInput('text', 'checklistTitle', 'checklistTitle', true, '', addChecklistForm);
    createLabel('checklistDueDate', 'Due date: ', addChecklistForm);
    const checklistDuedateInput = createInput('date', 'checklistDueDate', 'checklistDueDate', '', '', addChecklistForm);

    const listItemsFieldset = document.createElement('fieldset');
    listItemsFieldset.classList.add('list-items-fieldset');
    addChecklistForm.appendChild(listItemsFieldset);
    const listItemsLegend = document.createElement('legend');
    listItemsLegend.textContent = 'Checklist items';
    listItemsFieldset.appendChild(listItemsLegend);
    const createListItemInput = createButton('+', '', 'create-list-item-button', listItemsFieldset);
    createListItemInput.type = 'button';
    createLabel('create-list-item-button', 'Press here to add new a new checklist item', listItemsFieldset);
    const listItemsContainer = createDivContainer('list-item-container', '', listItemsFieldset);
    const emptyListItemsContainerMessage = createTextElem('p', 'No items currently added. You can add them now, or later, after the checklist is created.', listItemsFieldset);

    const createListItemInputRow = () => {
        const listItemRowContainer = createDivContainer('list-item-row', '', listItemsContainer)
        const listItemInput = createInput('text', '', '', true, '', listItemRowContainer);
        const removeContainerBtn = createButton('x', '', '', listItemRowContainer);
        removeContainerBtn.classList.add('remove-item-button')
        removeContainerBtn.addEventListener('click', () => {
            listItemRowContainer.parentElement.removeChild(listItemRowContainer);
            if (listItemsContainer.children.length < 1) emptyListItemsContainerMessage.style.display = 'block';
        });
        if (listItemsContainer.children.length >= 1) emptyListItemsContainerMessage.style.display = 'none';
    };

    createListItemInput.addEventListener('click', createListItemInputRow);

    const cancelBtn = createButton('Cancel', 'cancel-button', '', addChecklistForm);
    cancelBtn.type = 'button';
    const createChecklistBtn = createButton('Confirm', 'submit-button', '', addChecklistForm);
    checklistCreateModal.appendChild(addChecklistForm);


    const checklistsList = document.createElement('ul');
    checklistsList.id = 'checklists-list';
    checklistsContainer.appendChild(checklistsList);

    const createChecklistBtnHandler = (project) => {
        if (!addChecklistForm.checkValidity()) return;

        const listItemsValuesArray = Array.from(document.querySelectorAll('.list-item-container input[type="text"]')).map(input => input.value);

        console.log(listItemsValuesArray);

        project.addChecklist(createChecklist(checklistTitleInput.value, checklistDuedateInput.value, listItemsValuesArray, false));
        updateChecklistsDOM(project, 'checklists-list');
    };

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
        listItemsContainer.replaceChildren();
        checklistTitleInput.removeAttribute('required');
        addChecklistForm.reset();
        setTimeout(() => {
            checklistTitleInput.setAttribute('required', '');
        }, 100);
    });

    return checklistsContainer;
}

