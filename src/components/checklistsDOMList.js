import { createButton, createDivContainer, createTextElem } from './DOMElementCreationMethods.js';

export default function updateChecklistsDOM(project) {
    const checklistsList = document.getElementById('checklists-list');
    checklistsList.replaceChildren();

    const test = document.createElement('p');

    test.textContent = project.checklists[0].title;
    checklistsList.appendChild(test);
}