import { projectsManager } from './projectsManager';
import { createTextElem, createDivContainer } from './DOMElementCreationMethods';
import { renderTasks, renderChecklists } from './manageDOM';

export default function thisWeekItemsDOMList() {
    const thisWeekItemsContainer = document.createElement('div');
    thisWeekItemsContainer.classList.add('project-container' ,'thisWeek-items-container');

    const main = document.querySelector('main');
    createTextElem('h2', 'This Week\'s items', thisWeekItemsContainer);
    main.appendChild(thisWeekItemsContainer);

    const tasksContainer = createDivContainer('tasks-container', '', thisWeekItemsContainer);
    tasksContainer.classList.add('sub-project-container');
    createTextElem('h3', 'This Week\'s tasks', tasksContainer);
    const thisWeekTasksList = document.createElement('ul');
    thisWeekTasksList.id = 'thisWeek-tasks-list';
    tasksContainer.appendChild(thisWeekTasksList);
    const IDtoAppendThisWeekTasks = 'thisWeek-tasks-list';

    const checklistsContainer = createDivContainer('checklists-container', '', thisWeekItemsContainer);
    checklistsContainer.classList.add('sub-project-container');
    createTextElem('h3', 'This Week\'s checklists', checklistsContainer);
    const thisWeekChecklistsList = document.createElement('ul');
    thisWeekChecklistsList.id = 'thisWeek-checklists-list';
    checklistsContainer.appendChild(thisWeekChecklistsList); 
    const IDtoAppendThisWeekChecklists = 'thisWeek-checklists-list';

    const thisWeekTasksDummyProject = projectsManager.dummyProjectsArr[4];
    thisWeekTasksDummyProject.filterThisWeekTasks();
    renderTasks(thisWeekTasksDummyProject, IDtoAppendThisWeekTasks);

    const thisWeekChecklistsDummyProject = projectsManager.dummyProjectsArr[5];
    thisWeekChecklistsDummyProject.filterThisWeekChecklists();
    renderChecklists(thisWeekChecklistsDummyProject, IDtoAppendThisWeekChecklists);
};