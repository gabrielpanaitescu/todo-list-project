import nav from './nav.js';
import { createButton, createDivContainer, createTextElem } from './DOMElementCreationMethods.js';
import createProjectDOMContainer from './projectDOMContainer.js';
import updateTasksDOM from './tasksDOMList.js';
import updateNotesDOM from './notesDOMList.js';
import updateChecklistsDOM from './checklistsDOMList.js';
import { projectsManager } from './createProject.js';

const main = document.querySelector('main');
const aside = document.querySelector('aside');
aside.appendChild(nav.navDOMElem);

const clearMain = () => {
    main.replaceChildren();
}

const renderProject = (project) => {
    clearMain();
    const projectContainer = createProjectDOMContainer(project);
    main.appendChild(projectContainer);
    
    renderTasks(project, 'tasks-list');
    renderChecklists(project, 'checklists-list');
    renderNotes(project, 'notes-list');
};

const renderDefaultProject = () => {
    const personalProject = projectsManager.projectsArr[0];
    renderProject(personalProject);
};

const renderTasks = (project, appendToID) => {
    if (project.tasks.length < 1) return;
    updateTasksDOM(project, appendToID);
};

const renderChecklists = (project) => {
    if (project.checklists.length < 1) return;
    updateChecklistsDOM(project);
};

const renderNotes = (project, appendToID) => {
    if (project.notes.length < 1) return;
    updateNotesDOM(project, appendToID);
};


export { renderProject, renderDefaultProject, clearMain };



