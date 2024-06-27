import { createDivContainer, createTextElem, createMaterialIcon, createLabel, createButton } from "./DOMElementCreationMethods"

const nav = document.querySelector('aside');
const mainContainer = document.querySelector('div.main-container');
const main = document.querySelector('main');
const header = document.querySelector('header');


export function createLogoContainer() {
    const container = createDivContainer('logo-container');
    createTextElem('h1', 'todo list', container);
    createMaterialIcon('content_paste', 'material-icons', container);
    return container;
}

export function createToggleNavContainer() {
    const container = createDivContainer('toggle-nav-container');
    const toggleNavButton = createButton('', '', 'toggle-nav-button', container);
    toggleNavButton.classList.add('nav-hidden')
    toggleNavButton.ariaLabel = 'toggle-nav';
    createMaterialIcon('A', 'icon', toggleNavButton);

    toggleNavButton.addEventListener('click', () => {
        toggleNavButton.classList.toggle('nav-hidden');
        nav.classList.toggle('hidden');
        header.classList.toggle('nav-hidden');
        main.classList.toggle('nav-hidden');
        mainContainer.classList.toggle('nav-hidden');
    });

    return container;
}