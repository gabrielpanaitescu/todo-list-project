import { createButton, createDivContainer, createTextElem } from './DOMElementCreationMethods.js';

export default function updateChecklistsDOM(checklists) {
    const checklistsList = document.getElementById('checklists-list');
    checklistsList.replaceChildren();

    const test = document.createElement('p');

    test.textContent = checklists[0].title;
    checklistsList.appendChild(test);
}