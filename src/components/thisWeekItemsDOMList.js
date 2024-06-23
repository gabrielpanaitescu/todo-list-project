import { projectsManager } from './createProject';
import { createTextElem } from './DOMElementCreationMethods';
import { renderTasks, renderChecklists } from './manageDOM';

export default function thisWeekItemsDOMList() {
    const thisWeekItemsContainer = document.createElement('div');
    thisWeekItemsContainer.classList.add('thisWeek-items-container');

    const main = document.querySelector('main');
    createTextElem('h2', 'This Week\'s items', main);
    main.appendChild(thisWeekItemsContainer);

    createTextElem('h3', 'This Week\'s tasks', thisWeekItemsContainer);
    const thisWeekTasksList = document.createElement('ul');
    thisWeekTasksList.id = 'thisWeek-tasks-list';
    thisWeekItemsContainer.appendChild(thisWeekTasksList);
    const IDtoAppendThisWeekTasks = 'thisWeek-tasks-list';

    createTextElem('h3', 'This Week\'s checklists', thisWeekItemsContainer);
    const thisWeekChecklistsList = document.createElement('ul');
    thisWeekChecklistsList.id = 'thisWeek-checklists-list';
    thisWeekItemsContainer.appendChild(thisWeekChecklistsList); 
    const IDtoAppendThisWeekChecklists = 'thisWeek-checklists-list';

    const thisWeekTasksDummyProject = projectsManager.dummyProjectsArr[4];
    thisWeekTasksDummyProject.filterThisWeekTasks();
    renderTasks(thisWeekTasksDummyProject, IDtoAppendThisWeekTasks);

    const thisWeekChecklistsDummyProject = projectsManager.dummyProjectsArr[5];
    thisWeekChecklistsDummyProject.filterThisWeekChecklists();
    renderChecklists(thisWeekChecklistsDummyProject, IDtoAppendThisWeekChecklists);
};