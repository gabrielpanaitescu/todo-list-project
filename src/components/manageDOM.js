import nav from './nav.js';
import { createButton, createDivContainer, createTextElem } from './DOMElementCreationMethods.js';
import createProjectDOMContainer from './projectDOMContainer.js';
import updateTasks from './tasksDOMList.js';
import updateNotes from './notesDOMList.js';
import updateChecklists from './checklistsDOMList.js';
import { projectsManager } from './createProject.js';
import updateAllItems from './allItemsDOMList.js';

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

const renderTasks = (project, appendToID) => {
    // if (project.tasks.length < 1) return;
    updateTasks(project, appendToID);
};

const renderChecklists = (project, appendToID) => {
    // if (project.checklists.length < 1) return;
    updateChecklists(project, appendToID);
};

const renderNotes = (project, appendToID) => {
    // if (project.notes.length < 1) return;
    updateNotes(project, appendToID);
};

const renderAllItems = () => {
    nav.renderNav();
    clearMain();
    updateAllItems();
};

export { renderProject, renderDefaultProject, renderAllItems, clearMain, displayEmptyMainMessage, renderTasks, renderChecklists, renderNotes };



