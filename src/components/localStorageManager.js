import { projectsManager, projectProto } from "./createProject";

const updateLocalStorage = () => {
    const stringifiedProjectsArr = JSON.stringify(projectsManager.projectsArr);
    localStorage.setItem('projectsArrLocalStorage', stringifiedProjectsArr);
};

const parseProjectsArrFromLocalStorage = () => {
    const parsedProjectsArr = 
        JSON.parse(localStorage.getItem('projectsArrLocalStorage'))
        .map(project => Object.assign(Object.create(projectProto), project));
    // re-add prototype after going through the JSON stringify => parse process

    projectsManager.projectsArr = parsedProjectsArr;
};

const checkForLocalStorageData = () => {
    const localStorageData = localStorage.getItem('projectsArrLocalStorage');
    return localStorageData;
};

export { updateLocalStorage, parseProjectsArrFromLocalStorage, checkForLocalStorageData};