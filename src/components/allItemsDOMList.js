import updateTasks from './tasksDOMList';
import { projectsManager } from './createProject';
import { createTextElem } from './DOMElementCreationMethods';
import { renderTasks, renderChecklists } from './manageDOM';

export default function allItemsDOMList() {
    const allItemsContainer = document.createElement('div');
    allItemsContainer.classList.add('all-items-container');

    const main = document.querySelector('main');
    createTextElem('h2', 'All items', main);
    main.appendChild(allItemsContainer);

    createTextElem('h3', 'All tasks', allItemsContainer);
    const allTasksList = document.createElement('ul');
    allTasksList.id = 'all-tasks-list';
    allItemsContainer.appendChild(allTasksList);

    createTextElem('h3', 'All checklists', allItemsContainer);
    const allChecklistsList = document.createElement('ul');
    allChecklistsList.id = 'all-checklists-list';
    allItemsContainer.appendChild(allChecklistsList); 

    const dummyProjectWithAllTasks = projectsManager.dummyProjectsArr[0];
    dummyProjectWithAllTasks.updateTasksArr();
    renderTasks(dummyProjectWithAllTasks, 'all-tasks-list');

    const dummyProjectWithAllChecklists = projectsManager.dummyProjectsArr[1];
    dummyProjectWithAllChecklists.updateChecklistsArr();
    renderChecklists(dummyProjectWithAllChecklists, 'all-checklists-list');
};