import { projectsManager } from './projectsManager';
import { createTextElem, createDivContainer } from './DOMElementCreationMethods';
import { renderTasks, renderChecklists } from './manageDOM';

export default function todaysItemsDOMList() {
    const todaysItemsContainer = document.createElement('div');
    todaysItemsContainer.classList.add('project-container','todays-items-container');

    const main = document.querySelector('main');
    createTextElem('h2', 'Today\'s items', todaysItemsContainer);
    main.appendChild(todaysItemsContainer);

    const tasksContainer = createDivContainer('tasks-container', '', todaysItemsContainer);
    tasksContainer.classList.add('sub-project-container');
    createTextElem('h3', 'Tasks', tasksContainer);
    const todaysTasksList = document.createElement('ul');
    todaysTasksList.id = 'todays-tasks-list';
    tasksContainer.appendChild(todaysTasksList);
    const IDtoAppendTodaysTasks = 'todays-tasks-list';

    const checklistsContainer = createDivContainer('checklists-container', '', todaysItemsContainer);
    checklistsContainer.classList.add('sub-project-container');
    createTextElem('h3', 'Checklists', checklistsContainer);
    const todaysChecklistsList = document.createElement('ul');
    todaysChecklistsList.id = 'todays-checklists-list';
    checklistsContainer.appendChild(todaysChecklistsList); 
    const IDtoAppendTodaysChecklists = 'todays-checklists-list';

    const todaysTasksDummyProject = projectsManager.dummyProjectsArr[2];
    todaysTasksDummyProject.filterTodaysTasks();
    renderTasks(todaysTasksDummyProject, IDtoAppendTodaysTasks);

    const todaysChecklistsDummyProject = projectsManager.dummyProjectsArr[3];
    todaysChecklistsDummyProject.filterTodaysChecklists();
    renderChecklists(todaysChecklistsDummyProject, IDtoAppendTodaysChecklists);
};