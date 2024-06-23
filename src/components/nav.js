import { projectsManager, createProject } from "./createProject";
import { renderProject, renderAllItems, renderTodaysItems, renderNextWeekItems } from "./manageDOM.js"
import { createButton, createDivContainer, createTextElem, createLabel, createInput } from './DOMElementCreationMethods.js';

const createNavElement = () => {
    const nav = document.createElement('nav');

    createTextElem('h1', 'todo list', nav);

    const quickNavContainer = createDivContainer('nav-container', 'quick-nav-container', nav);
    const allItemsBtn = createButton('All items', 'quick-nav-btn', '', quickNavContainer);
    const todayItemsBtn = createButton('Today', 'quick-nav-btn', '', quickNavContainer);
    const nextWeekItemsBtn = createButton('Next 7 days', 'quick-nav-btn', '', quickNavContainer);

    const projectCreateContainer = createDivContainer('project-create', '', nav);
    projectCreateContainer.classList.add('modal-container');
    const openProjectCreateModal = createButton('Create new project', 'open-modal-button', '', projectCreateContainer);

    const projectModal = document.createElement('dialog');
    projectCreateContainer.appendChild(projectModal);
    const createProjectForm = document.createElement('form');
    projectModal.appendChild(createProjectForm);
    createProjectForm.method = 'dialog';
    createLabel('projectTitle', 'Project title: ', createProjectForm);
    const inputProjectTitle = createInput('text', 'projectTitle', 'projectTitle', true, '', createProjectForm);
    const cancelBtn = createButton('Cancel', 'cancel-button', '', createProjectForm);
    const createProjectBtn = createButton('Confirm', 'submit-button','', createProjectForm);
    cancelBtn.type = 'button';

    createTextElem('h2', 'My projects', nav);

    const projectsNavContainer = createDivContainer('nav-container', 'projects-nav-container', nav);

    const projectBtnHandler = (project) => {
        console.log(project);
        renderProject(project);
    };

    const createNavItem = (project) => {
        const projectBtnContainer = createDivContainer('project-btn-container', '', projectsNavContainer);

        projectBtnContainer.dataset.projectIndex = projectsManager.projectsArr.indexOf(project);

        const projectBtn = createButton(project.title, 'nav-project-button', '', projectBtnContainer);
        projectBtn.addEventListener('click', () => {
            projectBtnHandler(project);
        });

        return projectBtn;
    };

    function createEditProjectTitleButton(index, project) {        
        const editProjectTitleContainer = createDivContainer('modal-container', '', '');

        const targetContainer = Array.from(document.querySelectorAll('.project-btn-container')).find(elem => elem.dataset.projectIndex == index);

        targetContainer.appendChild(editProjectTitleContainer)

        editProjectTitleContainer.classList.add('edit-project-title-modal');
        editProjectTitleContainer.classList.add('edit-container');

        const openEditProjectTitleModal = createButton('Edit title', 'open-modal-button', '', editProjectTitleContainer);
        const editProjectTitleModal = document.createElement('dialog');
        editProjectTitleContainer.appendChild(editProjectTitleModal);
        const editProjectTitleForm = document.createElement('form');
        editProjectTitleForm.method = 'dialog';
        createLabel('editProjectTitleTitle', 'Project title', editProjectTitleForm);
        const editProjectTitleTitleInput = createInput('text', 'editProjectTitleTitle', 'editProjectTitleTitle', true, '', editProjectTitleForm);
        editProjectTitleTitleInput.readOnly = true;

        const cancelEditBtn = createButton('Cancel', 'cancel-button', '', editProjectTitleForm);
        cancelEditBtn.type = 'button';

        const editProjectTitleBtn = createButton('Save and close', 'submit-button', '', editProjectTitleForm);
        editProjectTitleModal.appendChild(editProjectTitleForm);


        const editProjectTitleBtnHandler = () => {
            editProjectTitleTitleInput.readOnly = false;

            if (!editProjectTitleForm.checkValidity()) return;
            
            project.title = editProjectTitleTitleInput.value;

            renderNav();
            renderProject(project);
        };

        const editProjectTitleInputsToReadWrite = (e) => {
            e.target.readOnly = false;
        };

        const editProjectTitleInputsToReadOnly = (e) => {
            e.target.readOnly = true;
        };

        editProjectTitleTitleInput.addEventListener('click', editProjectTitleInputsToReadWrite);
        editProjectTitleTitleInput.addEventListener('focusout', editProjectTitleInputsToReadOnly);

        editProjectTitleBtn.addEventListener('click', editProjectTitleBtnHandler);

        editProjectTitleForm.addEventListener('submit', (e) => {
            editProjectTitleTitleInput.removeAttribute('required');
            editProjectTitleForm.reset();
            setTimeout(() => {
                editProjectTitleTitleInput.setAttribute('required', '');
            }, 100);
        });

        openEditProjectTitleModal.addEventListener('click', () => {
            editProjectTitleTitleInput.value = project.title;
            editProjectTitleModal.showModal();
        });

        cancelEditBtn.addEventListener('click', () => editProjectTitleModal.close());
    }

    const renderNav = () => {
        projectsNavContainer.replaceChildren();
        const projects = projectsManager.projectsArr;
        if (projects.length > 0) {
            projects.forEach((project) => {
                createNavItem(project);
            });
        }
    };

    nextWeekItemsBtn.addEventListener('click', () => {
        renderNextWeekItems();
    });

    todayItemsBtn.addEventListener('click', () => {
        renderTodaysItems();
    });
        
    allItemsBtn.addEventListener('click', () => {
        renderAllItems();
    });

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

    createProjectForm.addEventListener('submit', (e) => {
        inputProjectTitle.removeAttribute('required');
        createProjectForm.reset();
        setTimeout(() => {
            inputProjectTitle.setAttribute('required', '');
        }, 100);
      });

    openProjectCreateModal.addEventListener('click', () => {
        projectModal.showModal();
    });

    renderNav();

    return { navDOMElem: nav, renderNav, createEditProjectTitleButton };
};

export default createNavElement();
