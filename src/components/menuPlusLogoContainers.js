import { createDivContainer, createTextElem, createMaterialIcon, createLabel, createButton } from "./DOMElementCreationMethods"

export function createLogoContainer() {
    const container = createDivContainer('logo-container');
    createTextElem('h1', 'todo list', container);
    createMaterialIcon('content_paste', 'material-icons', container);
    return container;
}

export function createMenuContainer() {
    const container = createDivContainer('menu-container');
    const menuButton = createButton('', '', 'menu-button', container);
    menuButton.ariaLabel = 'toggle-nav';
    createMaterialIcon('D', 'icon', menuButton);

    const nav = document.querySelector('aside');
    const main = document.querySelector('main');
    const header = document.querySelector('header');

    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('nav-hidden');
        nav.classList.toggle('hidden');
        header.classList.toggle('nav-hidden');
        main.classList.toggle('nav-hidden');
    });

    return container;
}