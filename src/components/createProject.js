import { format } from "date-fns";

const projectsManager = {
    projectsArr: [],
    addProject(projectObj) {
        if (this.projectsArr.find((item) => item.title === projectObj.title)) throw Error('Project with this name already exists');
        this.projectsArr.push(projectObj);
    },
    // to see if the arguments can be reduced to a single one (the item that needs to be moved)
    moveProjectItem(itemType, itemIndex, initialProjectIndex, targetProjectIndex) {
        const itemLocation = this.projectsArr[initialProjectIndex][itemType];
        const targetLocation = this.projectsArr[targetProjectIndex][itemType];
        targetLocation.push(itemLocation[itemIndex]);
        itemLocation.splice(itemIndex, 1);
    },
    deleteProject(project) {
        this.projectsArr = this.projectsArr.filter(elem => elem !== project);
    }
};

const projectProto = {
    addNote(noteObj)  {
        this.notes.push(noteObj)
    },
    
    addTask(taskObj)  {
        this.tasks.push(taskObj)
    },

     addChecklist(checklistObj)  {
        this.checklists.push(checklistObj)
    },
    // to see if arguments can be changed to a single on => the item that needs to be removed
    removeItem(itemType, item) {
        this[itemType] = this[itemType].filter(elem => elem !== item);
    },

    editNote(note, title, description) {
        const noteIndex = this.notes.indexOf(note);
        const targetNote = this.notes[noteIndex] 
        targetNote.title = title;
        targetNote.description = description;
    },

    editTask(task, title, description, importance, dueDate) {
        const taskIndex = this.tasks.indexOf(task);
        const targetTask = this.tasks[taskIndex];
        targetTask.title = title;
        targetTask.description = description;
        targetTask.importance = importance;
        targetTask.dueDate = formatForDateInput(dueDate);
    },
};

const createProject = (title) => {
    return Object.assign(Object.create(projectProto), { title, notes: [], tasks: [], checklists: [] })
};

const createNote = (title, description) => ({ title, description });

const createTask = (title, description, importance, dueDate, completed = false) => ({ title, description, importance, dueDate: formatForDateInput(dueDate), completed });

const createListItem = (title) => ({ title, completed: false });

const createChecklist = (title, dueDate, listItems, completed = false) => {

    const processListItemsToObjects = (arr) => {
        if (arr.length >= 1) return arr.map(item => createListItem(item));
        return null;
    };

    listItems = processListItemsToObjects(listItems);

    if (!dueDate) dueDate = null;
    if (dueDate) dueDate = formatForDateInput(dueDate);

    return { title, dueDate, listItems, completed };
};

function formatForDateInput(date) {
    return format(date, 'yyyy-MM-dd');
}

const newProject = createProject('Personal');
projectsManager.addProject(newProject);
const newProject2 = createProject('Project 1');
projectsManager.addProject(newProject2);

newProject.addNote(createNote('Note title', 'description'));
newProject.addTask(createTask('Task 1', 'description', 'High', new Date(), false));
newProject.addChecklist(createChecklist('Checklist 1', new Date(), ['Item 1', 'Item 2']));

newProject2.addNote(createNote('Note 2 title', 'description'));
newProject2.addNote(createNote('Note 3 title', 'Other description'));
newProject2.addTask(createTask('Task 2', 'description', 'High', new Date(), false));
newProject2.addChecklist(createChecklist('Checklist 2', new Date(), ['Item 2', 'Item 3']));


const newProject3 = createProject('Project 2');
projectsManager.addProject(newProject3);
newProject3.addNote(createNote('Note 3 title', 'description'));
newProject3.addTask(createTask('Task 3', 'description', 'High', new Date()), false);
newProject3.addChecklist(createChecklist('Checklist 3', new Date(), ['Item 2', 'Item 3']));

console.log(newProject);

// move example
// projectsManager.moveProjectItem('notes', 0, 0, 1);
// console.log(projectsManager);

// remove example
// newProject2.removeItem('notes', 0);
// console.log(projectsManager);

export { projectsManager, createProject, createNote, createTask, createChecklist, createListItem };





// const listItemsInputs = (() => {
//     let inputs = [];

//     const addInput = () => {
//         inputs.push(createInput('text', '', '', true, 3));
//     };

//     addInput();

//     const appendInputsTo = (target) => {
//         inputs.forEach(input => {
//             target.appendChild(input);
//         });
//     }

//     return { appendInputs };
// })();
// listItemsInputs.appendInputsTo(listItemsFieldset);



// const inputsContainer = createDivContainer('list-item-container', '', document.body);

// function listItemsInputs(nrOfInputs = 1) {
//     let inputs = [];
//     inputsContainer.replaceChildren();

//     const addInputButton = createButton('+', '', '', inputsContainer);
//     let numberOfInputs = nrOfInputs;

//     for(let i = 0; i < numberOfInputs; i++) {
//         const listItemInput = createInput('text', `listItemInput${i}`, `listItemInput${i}`, true, 3, inputsContainer);
//     }

//     addInputButton.addEventListener('click', () => { 
//         numberOfInputs++
//         listItemsInputs(numberOfInputs);
//         console.log(numberOfInputs);
//     });

// }

// listItemsInputs();