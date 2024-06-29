import { projectsManager } from './projectsManager';
import { createDivContainer, createTextElem } from './DOMElementCreationMethods';
import { renderTasks, renderChecklists } from './manageDOM';

export default function allItemsDOMList() {
    const allItemsContainer = document.createElement('div');
    allItemsContainer.classList.add('project-container', 'all-items-container');

    const main = document.querySelector('main');
    createTextElem('h2', 'All items', allItemsContainer);
    main.appendChild(allItemsContainer);

    const tasksContainer = createDivContainer('tasks-container', '', allItemsContainer);
    tasksContainer.classList.add('sub-project-container');
    createTextElem('h3', 'All tasks', tasksContainer);
    const allTasksList = document.createElement('ul');
    allTasksList.id = 'all-tasks-list';
    tasksContainer.appendChild(allTasksList);
    const IDtoAppendTasks = 'all-tasks-list';

    const checklistsContainer = createDivContainer('checklists-container', '', allItemsContainer);
    checklistsContainer.classList.add('sub-project-container');
    createTextElem('h3', 'All checklists', checklistsContainer);
    const allChecklistsList = document.createElement('ul');
    allChecklistsList.id = 'all-checklists-list';
    checklistsContainer.appendChild(allChecklistsList); 
    const IDtoAppendChecklists = 'all-checklists-list'


    const allTasksDummyProject = projectsManager.dummyProjectsArr[0];
    allTasksDummyProject.updateTasksArr();
    renderTasks(allTasksDummyProject, IDtoAppendTasks);

    const allChecklistsDummyProject = projectsManager.dummyProjectsArr[1];
    allChecklistsDummyProject.updateChecklistsArr();
    renderChecklists(allChecklistsDummyProject, IDtoAppendChecklists);
};