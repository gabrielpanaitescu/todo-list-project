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
    const noteTitleInput = createInput('text', 'noteTitle', 'noteTitle', true, 3, addNoteForm);
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
        if (!noteTitleInput.validity.valid || !noteDescriptionInput.validity.valid) return;
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
    const taskTitleInput = createInput('text', 'taskTitle', 'taskTitle', true, 3, addTaskForm);
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
        if (!taskTitleInput.validity.valid || !taskDescriptionInput.validity.valid || !taskImportanceSelect.validity.valid || !taskDuedateInput.validity.valid) return;

        project.addTask(createTask(taskTitleInput.value, taskDescriptionInput.value, taskImportanceSelect.value, new Date(taskDuedateInput.value), false));
        updateTasksDOM(project.tasks, 'tasks-list');
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

    // revise this!!!!
    // addNoteForm.addEventListener('submit', (e) => {
    //     noteTitleInput.removeAttribute('required');
    //     noteDescriptionInput.removeAttribute('required');
    //     addNoteForm.reset();
    //     setTimeout(() => {
    //         noteTitleInput.setAttribute('required', '');
    //         noteDescriptionInput.setAttribute('required', '');
    //     }, 100);
    //   });

    return tasksContainer;
}

function createChecklistsContainer(project) {
    const checklistsContainer = document.createElement('div');
    checklistsContainer.classList.add('checklists-container', 'sub-project-container');
    createTextElem('h3', 'Checklists', checklistsContainer);
    const checklistsList = document.createElement('ul');
    checklistsList.id = 'checklists-list';
    checklistsContainer.appendChild(checklistsList);

    return checklistsContainer;
}