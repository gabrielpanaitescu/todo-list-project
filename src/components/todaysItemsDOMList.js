import { projectsManager } from './projectsManager';
import { createTextElem } from './DOMElementCreationMethods';
import { renderTasks, renderChecklists } from './manageDOM';

export default function todaysItemsDOMList() {
    const todaysItemsContainer = document.createElement('div');
    todaysItemsContainer.classList.add('todays-items-container');

    const main = document.querySelector('main');
    createTextElem('h2', 'Today\'s items', main);
    main.appendChild(todaysItemsContainer);

    createTextElem('h3', 'Today\'s tasks', todaysItemsContainer);
    const todaysTasksList = document.createElement('ul');
    todaysTasksList.id = 'todays-tasks-list';
    todaysItemsContainer.appendChild(todaysTasksList);
    const IDtoAppendTodaysTasks = 'todays-tasks-list';

    createTextElem('h3', 'Today\'s checklists', todaysItemsContainer);
    const todaysChecklistsList = document.createElement('ul');
    todaysChecklistsList.id = 'todays-checklists-list';
    todaysItemsContainer.appendChild(todaysChecklistsList); 
    const IDtoAppendTodaysChecklists = 'todays-checklists-list';

    const todaysTasksDummyProject = projectsManager.dummyProjectsArr[2];
    todaysTasksDummyProject.filterTodaysTasks();
    renderTasks(todaysTasksDummyProject, IDtoAppendTodaysTasks);

    const todaysChecklistsDummyProject = projectsManager.dummyProjectsArr[3];
    todaysChecklistsDummyProject.filterTodaysChecklists();
    renderChecklists(todaysChecklistsDummyProject, IDtoAppendTodaysChecklists);
};