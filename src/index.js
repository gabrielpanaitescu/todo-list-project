import './components/manageDOM.js'
import './components/inputEditItemStyle.css';
import './style.css'
import { parseProjectsArrFromLocalStorage, checkForLocalStorageData } from './components/localStorageManager'
import { projectsManager, createDefaultProject } from './components/createProject.js';
import nav from './components/nav.js'

// This if will only pass the first time a machine/device (with no localStorage data on in) will access the page. The addProject() method will create the 'projectsArrLocalStorage' key in localStorage, thus making this if statement passable only if the key is removed manually or the webpage is accessed through a new machine/device
if (!checkForLocalStorageData()) projectsManager.addProject(createDefaultProject());
if (checkForLocalStorageData()) parseProjectsArrFromLocalStorage();

// initial render
nav.renderNav();

console.log(projectsManager);

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
