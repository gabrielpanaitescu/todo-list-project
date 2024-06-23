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
    const IDtoAppendTasks = 'all-tasks-list';

    createTextElem('h3', 'All checklists', allItemsContainer);
    const allChecklistsList = document.createElement('ul');
    allChecklistsList.id = 'all-checklists-list';
    allItemsContainer.appendChild(allChecklistsList); 
    const IDtoAppendChecklists = 'all-checklists-list'


    const allTasksDummyProject = projectsManager.dummyProjectsArr[0];
    allTasksDummyProject.updateTasksArr();
    renderTasks(allTasksDummyProject, IDtoAppendTasks);

    const allChecklistsDummyProject = projectsManager.dummyProjectsArr[1];
    allChecklistsDummyProject.updateChecklistsArr();
    renderChecklists(allChecklistsDummyProject, IDtoAppendChecklists);
};