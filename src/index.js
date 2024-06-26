import './components/stylesheets/anicons/anicons-regular.css';
import 'material-icons/iconfont/filled.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './components/stylesheets/globalStyles.scss'
import './components/stylesheets/mixins.scss'
import './components/stylesheets/editInputStyles.css';
import './components/stylesheets/itemCompleted.css';
import './components/stylesheets/navStyles.scss'
import './components/stylesheets/mainStyles.scss'
import './components/stylesheets/headerStyles.scss'
import './components/manageDOM.js'
import { parseProjectsArrFromLocalStorage, checkForLocalStorageData } from './components/localStorageManager.js'
import { projectsManager, createDefaultProject } from './components/projectsManager.js';
import { createLogoContainer, createMenuContainer } from './components/menuPlusLogoContainers.js';
import nav from './components/nav'


// if statement will only pass the first time a machine/device (with no localStorage data on in) will access the page. The addProject() method will create the 'projectsArrLocalStorage' key in localStorage, thus making this if statement passable only if the key is removed manually or the webpage is accessed from a new machine/device
if (!checkForLocalStorageData()) {
    projectsManager.addProject(createDefaultProject());
} else if (checkForLocalStorageData()) {
    parseProjectsArrFromLocalStorage();
}
  
// initial render of the nav
const aside = document.body.querySelector('aside');
const header = document.body.querySelector('header');
header.appendChild(createLogoContainer());
aside.appendChild(createMenuContainer());
aside.appendChild(nav.navDOMElem);
nav.renderNav();


// anicons test element
// const testSpan = document.createElement('span');
// testSpan.classList.add('icon');
// testSpan.textContent = 'A';
// document.body.appendChild(testSpan);


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
