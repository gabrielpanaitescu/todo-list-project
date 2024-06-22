const moveChecklistContainer = createDivContainer('move-item-container', '', checklistWrapper);
createLabel('move-checklist', 'Move to project: ', moveChecklistContainer);
const moveChecklistSelect = document.createElement('select');
moveChecklistSelect.classList.add('move-item');
moveChecklistSelect.id = 'move-checklist';
moveChecklistContainer.appendChild(moveChecklistSelect);
projectsManager.projectsArr.forEach((projectObj, index) => {
    const moveChecklistOption = document.createElement('option');
    moveChecklistOption.value = projectObj.title;
    const originProject = projectsManager.findOriginProject('checklists', checklist);
    if (originProject.title === projectObj.title) moveChecklistOption.setAttribute('selected', '');
    if (moveChecklistOption.selected) moveChecklistOption.setAttribute('disabled', '');
    moveChecklistOption.dataset.projectIndex = index;
    moveChecklistOption.textContent = projectObj.title; 
    moveChecklistSelect.appendChild(moveChecklistOption);
});

const moveChecklistHandler = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    projectsManager.moveItemToProject('checklists', checklist, selectedOption.dataset.projectIndex);
    updateChecklistsDOM(project, 'checklists-list');
};

moveChecklistSelect.addEventListener('change', moveChecklistHandler);