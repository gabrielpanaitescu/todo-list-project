import { createDivContainer, createTextElem, createMaterialIcon, createAnicon, createButton } from "./DOMElementCreationMethods"

const nav = document.querySelector('aside');
const mainContainer = document.querySelector('div.main-container');
const main = document.querySelector('main');
const header = document.querySelector('header');
const backdrop = document.querySelector('#backdrop');

const toggleNavContainer = (() => {
    const container = createDivContainer('toggle-nav-container');
    const toggleNavButton = createButton('', '', 'toggle-nav-button', container);
    toggleNavButton.classList.add('nav-hidden')
    toggleNavButton.ariaLabel = 'toggle-nav';
    createAnicon('A', toggleNavButton);

    const toggleNavHidden = () => {
        toggleNavButton.classList.toggle('nav-hidden');
        nav.classList.toggle('hidden');
        header.classList.toggle('nav-hidden');
        main.classList.toggle('nav-hidden');
        mainContainer.classList.toggle('nav-hidden');
        backdrop.classList.toggle('nav-hidden');
    }

    toggleNavButton.addEventListener('click', () => {
        toggleNavHidden();
    });

    return { container, toggleNavHidden };
})();

export { toggleNavContainer }