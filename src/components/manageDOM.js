import nav from './nav';
import { createButton, createDivContainer, createTextElem } from './DOMElementCreationMethods';
import createProjectDOMContainer from './projectDOMContainer';
import updateTasks from './tasksDOMList';
import updateNotes from './notesDOMList';
import updateChecklists from './checklistsDOMList';
import { projectsManager } from './projectsManager';
import updateAllItems from './allItemsDOMList';
import updateTodaysItems from './todaysItemsDOMList';
import updateThisWeekItems from './thisWeekItemsDOMList'

const main = document.querySelector('main');
const aside = document.querySelector('aside');
aside.appendChild(nav.navDOMElem);

const displayEmptyMainMessage = () => {
    main.replaceChildren();
    createTextElem('h3', 'Select a project from the navigation bar. If no project is available, use the "Create new project" button!', main);
};

displayEmptyMainMessage();

const clearMain = () => {
    main.replaceChildren();
};

const renderProject = (project) => {
    clearMain();
    const projectContainer = createProjectDOMContainer(project);
    main.appendChild(projectContainer);

    // reset nav and delete previously appended edit project button
    nav.renderNav();
    const projectIndex = projectsManager.projectsArr.indexOf(project);
    nav.createEditProjectTitleButton(projectIndex, project);
    // non-deletable Personal project version
    // do not create edit button for personal project
    // if (projectIndex >= 1) nav.createEditProjectTitleButton(projectIndex, project);
    
    renderTasks(project, 'tasks-list');
    renderChecklists(project, 'checklists-list');
    renderNotes(project, 'notes-list');
};

const renderDefaultProject = () => {
    const personalProject = projectsManager.projectsArr[0];
    renderProject(personalProject);
};

const renderTasks = (project, IDtoAppend) => {
    // if (project.tasks.length < 1) return;
    updateTasks(project, IDtoAppend);
};

const renderChecklists = (project, IDtoAppend) => {
    // if (project.checklists.length < 1) return;
    updateChecklists(project, IDtoAppend);
};

const renderNotes = (project, IDtoAppend) => {
    // if (project.notes.length < 1) return;
    updateNotes(project, IDtoAppend);
};

const renderAllItems = () => {
    nav.renderNav();
    clearMain();
    updateAllItems();
};

const renderTodaysItems = () => {
    nav.renderNav();
    clearMain();
    updateTodaysItems();
};

const renderThisWeekItems = () => {
    nav.renderNav();
    clearMain();
    updateThisWeekItems();
};

export { renderProject, renderDefaultProject, renderAllItems, renderTodaysItems, renderThisWeekItems, clearMain, displayEmptyMainMessage, renderTasks, renderChecklists, renderNotes };



