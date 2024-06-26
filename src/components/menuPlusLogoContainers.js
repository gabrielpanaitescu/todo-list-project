import { createDivContainer, createTextElem, createMaterialIcon, createLabel, createButton } from "./DOMElementCreationMethods"

const nav = document.querySelector('aside');
const main = document.querySelector('main');
const header = document.querySelector('header');


export function createLogoContainer() {
    const container = createDivContainer('logo-container');
    createTextElem('h1', 'todo list', container);
    createMaterialIcon('content_paste', 'material-icons', container);
    return container;
}

export function createMenuContainer() {
    const container = createDivContainer('menu-container');
    const menuButton = createButton('', '', 'menu-button', container);
    menuButton.classList.add('nav-hidden')
    menuButton.ariaLabel = 'toggle-nav';
    createMaterialIcon('A', 'icon', menuButton);



    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('nav-hidden');
        nav.classList.toggle('hidden');
        header.classList.toggle('nav-hidden');
        main.classList.toggle('nav-hidden');
    });

    return container;
}