import './components/stylesheets/anicons/anicons-regular.css';
import 'material-icons/iconfont/filled.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './components/stylesheets/globalStyles.scss';
import './components/stylesheets/mixins.scss';
import './components/stylesheets/editInputStyles.scss';
import './components/stylesheets/navStyles.scss';
import './components/stylesheets/mainStyles.scss';
import './components/stylesheets/headerStyles.scss';
import './components/manageDOM.js';
import { parseProjectsArrFromLocalStorage, checkForLocalStorageData, updateLocalStorage } from './components/localStorageManager.js';
import { projectsManager, createDefaultProject } from './components/projectsManager.js';
import { createLogoContainer, createToggleNavContainer } from './components/menuPlusLogoContainers.js';
import nav from './components/nav';
import { renderDefaultProject, displayEmptyMainMessage } from './components/manageDOM.js';

// if statement will only pass the first time a machine/device (with no localStorage data on in) will access the page. The addProject() method will create the 'projectsArrLocalStorage' key in localStorage, thus making this if statement passable only if the key is removed manually or the webpage is accessed from a new machine/device
if (!checkForLocalStorageData()) {
    projectsManager.addProject(createDefaultProject());
} else if (checkForLocalStorageData()) {
    parseProjectsArrFromLocalStorage();
}
  
// need to bring the todos from the api (railway) 
// we need to call endpoint /todos/all
// get the data from the response and paste in localStorage
fetch('https://todo-api-production-06dc.up.railway.app/todos/all')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    updateLocalStorage(data);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });



const aside = document.body.querySelector('aside');
const header = document.body.querySelector('header');
// initial render of the nav on page load
header.appendChild(createLogoContainer());
aside.appendChild(createToggleNavContainer());
aside.appendChild(nav.navDOMElem);
const quickNavContainer = document.getElementById('quick-nav-container'); // used to attach event listeners on quick nav buttons to show which one is active
nav.renderNav();
// initial main render on page load; display the first project in the projectsArr 
renderDefaultProject();

// or display the empty main message that guides the user to choose a project from nav
// displayEmptyMainMessage();

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('div.main-container');

     // For transitions playing on page load / refresh. Delay it by adding a class with the transition wanted, 1ms after the DOM content has been loaded.
    setTimeout(function() {
        aside.classList.add('nav-transition-enabled');
        mainContainer.classList.add('main-container-transition-enabled');
    }, 1);

    // for side nav to display as open on page load for viewports bigger than 768px 
    if(window.innerWidth > 768) {
        const toggleNavButton = document.getElementById('toggle-nav-button');
        const mainContainer = document.querySelector('div.main-container');
        const main = document.querySelector('main');

        mainContainer.classList.remove('nav-hidden');
        main.classList.remove('nav-hidden');
        header.classList.remove('nav-hidden');
        aside.classList.remove('hidden');
        toggleNavButton.classList.remove('nav-hidden');
    }
});

// anicons test element
// const testSpan = document.createElement('span');
// testSpan.classList.add('icon');
// testSpan.textContent = 'A';
// document.body.appendChild(testSpan);

// this function works if quick nav tabs are rendered only by clicks; if they are rendered automatically on page load / actions like project tabs, the function and event listener should be reworked and should follow the project tab model (toggleActiveProjectTabUI(projectIndex); that will also mean the quick nav buttons will be re-rendered each time the function runs, which is not the case currently as the quick nav container is rendered only once
const setActiveQuickNavTab = (e) => {
    if (e.target.tagName !== "BUTTON") return;
    const previousActiveQuickNavTab = document.querySelector('.active-quickNav-tab');
    e.target.classList.add('active-quickNav-tab');
    if (previousActiveQuickNavTab) previousActiveQuickNavTab.classList.remove('active-quickNav-tab');
    // if a project tab will be clicked when a quick nav tab is active, the class will be removed by the toggleActiveProjectTabUI(projectIndex) function
};

// Function to disable autocomplete/suggestions on inputs
function disableAutocomplete() {
    document.querySelectorAll('input').forEach(input => {
        input.setAttribute('autocomplete', 'off');
    });
}
// Call function to disable autocomplete on initial inputs
disableAutocomplete();
// Event delegation to handle dynamically added inputs
document.addEventListener('focusin', function(event) {
    const target = event.target;
    if (target.matches('input')) {
        target.setAttribute('autocomplete', 'off');
    }
});
    
quickNavContainer.addEventListener('click', setActiveQuickNavTab);
