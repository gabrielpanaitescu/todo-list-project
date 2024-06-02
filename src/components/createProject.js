const projectsManager = {
    projectsArr: [],
    addProject(projectObj) {
        if (this.projectsArr.find((item) => item.title === projectObj.title)) throw Error('Project with this name already exists');
        this.projectsArr.push(projectObj);
    },
    // to see if arguments can be changed to a single on => the item that needs to be moved
    moveProjectItem(itemType, itemIndex, initialProjectIndex, targetProjectIndex) {
        const itemLocation = this.projectsArr[initialProjectIndex][itemType];
        const targetLocation = this.projectsArr[targetProjectIndex][itemType];
        targetLocation.push(itemLocation[itemIndex]);
        itemLocation.splice(itemIndex, 1);
    }
}

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
    removeItem(itemType, itemIndex) {
        this[itemType].splice(itemIndex, 1);
    }
};

const createProject = (title) => {
    return Object.assign(Object.create(projectProto), { title, notes: [], tasks: [], checklists: [] })
}

const createNote = (title, description) => ({ title, description });

const createTask = (title, description, importance, dueDate, completed) => ({ title, description, importance, dueDate, completed });

const createListItem = (title) => ({ title, completed: false });

const createChecklist = (title, completed, list) => {

    const processListItemsToObjects = (arr) => {
        return arr.map(item => createListItem(item))
    };

    list = processListItemsToObjects(list);

    return { title, completed, list };
};

// const newProject = createProject('Project 1');
// projectsManager.addProject(newProject);
// const newProject2 = createProject('Project 2');
// projectsManager.addProject(newProject2);

// newProject.addNote(createNote('asd', 'dfgdf'));
// console.log(projectsManager);

// projectsManager.moveProjectItem('notes', 0, 0, 1);
// console.log(projectsManager);

// newProject2.removeItem('notes', 0);
// console.log(projectsManager);

export { projectsManager, createProject, createNote, createTask, createChecklist, createListItem };


