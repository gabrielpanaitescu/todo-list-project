import { projectsManager, createProject, createNote, createTask, createChecklist, createListItem } from './createProject.js';

function manageDOM() {
    const openCreateProjectModal = document.querySelector('#open-project-modal-btn');
    const projectModal = document.querySelector('#project-modal')
    const createProjectBtn = document.querySelector('#create-project-btn');
    const createProjectTextInput = document.querySelector('#project-modal input#title')

    const projectsNavContainer = document.querySelector('#projects-nav-container');

    const renderProject = (project) => {

    };

    const createProjectElement = () => {
        const title = createProjectTextInput.value;
        const project = createProject(title);
        projectsManager.addProject(project);

        const projectBtn = document.createElement('button');
        projectBtn.textContent = title;
        projectsNavContainer.appendChild(projectBtn);

        projectBtn.addEventListener('click', () => {
            renderProject(project);
        });
    }
    
    createProjectBtn.addEventListener('click', createProjectElement);

    openCreateProjectModal.addEventListener('click', () => {
        projectModal.show();
    });
}   

manageDOM();