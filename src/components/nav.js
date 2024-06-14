import { projectsManager, createProject } from "./createProject";
import { renderProject } from "./manageDOM.js"
import { createButton, createDivContainer, createTextElem, createLabel, createInput } from './DOMElementCreationMethods.js';

const createNavElement = () => {
    const nav = document.createElement('nav');

    createTextElem('h1', 'todo list', nav);

    const quickNavContainer = createDivContainer('nav-container', 'quick-nav-container', nav);
    const allTasksBtn = createButton('All tasks', 'quick-nav-btn', '', quickNavContainer);
    const todayTasksBtn = createButton('Today', 'quick-nav-btn', '', quickNavContainer);
    const nextWeekTasksBtn = createButton('Next 7 days', 'quick-nav-btn', '', quickNavContainer);

    const projectCreateContainer = createDivContainer('project-create', '', nav);
    projectCreateContainer.classList.add('modal-container');
    const openProjectCreateModal = createButton('Add project', 'open-modal-button', '', projectCreateContainer);
    const projectModal = document.createElement('dialog');
    projectCreateContainer.appendChild(projectModal);
    const addProjectForm = document.createElement('form');
    projectModal.appendChild(addProjectForm);
    addProjectForm.method = 'dialog';
    createLabel('projectTitle', 'Project title: ', addProjectForm);
    const inputProjectTitle = createInput('text', 'projectTitle', 'projectTitle', true, 3, addProjectForm);
    const cancelBtn = createButton('Cancel', 'cancel-button', '', addProjectForm);
    const createProjectBtn = createButton('Confirm', 'submit-button','', addProjectForm);
    cancelBtn.type = 'button';

    createTextElem('h2', 'My projects', nav);

    const projectsNavContainer = createDivContainer('nav-container', 'projects-nav-container', nav);

    const projectBtnHandler = (project) => {
        console.log(project);
        renderProject(project);
    };

    const createNavItem = (project) => {
        const projectBtnContainer = createDivContainer('project-btn-container', '', projectsNavContainer);

        const projectBtn = createButton(project.title, 'project-button', '', projectBtnContainer);

        projectBtn.addEventListener('click', () => {
            projectBtnHandler(project);
        });

        return projectBtn;
    };

    const renderNav = () => {
        projectsNavContainer.replaceChildren();
        const projects = projectsManager.projectsArr;
        if (projects.length > 0) {
            projects.forEach((project) => {
                createNavItem(project);
            });
        }
    };

    createProjectBtn.addEventListener('click', () => {
        if (!inputProjectTitle.validity.valid) return;

        const project = createProject(inputProjectTitle.value);
        projectsManager.addProject(project);

        createNavItem(project);
        renderProject(project);
    });

    cancelBtn.addEventListener('click', () => {
        projectModal.close();
    });

    addProjectForm.addEventListener('submit', (e) => {
        inputProjectTitle.removeAttribute('required');
        addProjectForm.reset();
        setTimeout(() => {
            inputProjectTitle.setAttribute('required', '');
        }, 100);
      });

    openProjectCreateModal.addEventListener('click', () => {
        projectModal.showModal();
    });

    renderNav();

    return { navDOMElem: nav, renderNav };
};

export default createNavElement();
