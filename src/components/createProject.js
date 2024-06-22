import { format } from "date-fns";

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
    editChecklist(checklist, title, dueDate, listItems) {
        const checklistIndex = this.checklists.indexOf(checklist);
        const targetChecklist = this.checklists[checklistIndex];
        targetChecklist.title = title;
        if (!dueDate) targetChecklist.dueDate = null;
        if (dueDate) targetChecklist.dueDate = formatForDateInput(dueDate);
        targetChecklist.listItems = listItems;
    },
};

const projectsManager = {
    projectsArr: [],
    dummyProjectsArr: [],
    addProject(projectObj) {
        if (this.projectsArr.find((item) => item.title === projectObj.title)) throw Error('Project with this name already exists');
        this.projectsArr.push(projectObj);
    },
    // to see if the arguments can be reduced to a single one (the item that needs to be moved)
    findOriginProject(itemType, item) {
        return this.projectsArr
        .find(project => project[itemType]
        .find(elem => elem === item));
    },
    moveItemToProject(itemType, item, targetProjectIndex) {
        const targetProject = this.projectsArr[targetProjectIndex];
        const originProject = this.findOriginProject(itemType, item);
        originProject[itemType] = originProject[itemType].filter(elem => elem !== item);
        targetProject[itemType].push(item);

        // no update required to dummy projects as the change happens to an element inside the task component; updating the array will only change the order of the tasks upon moving action, as the tasks at the moment of writing this comment, are not sorted, but created and appended in the order of the projectsArray looping, from first created to last
    },
    removeItemFromProject(itemType, item) {
        const originProject = this.findOriginProject(itemType, item);
        originProject.removeItem(itemType, item);

        // update dummy projects that contains all tasks/checklists in order to reflect the change when the quick nav buttons (ex All items) are used; 
        if (itemType === 'tasks') dummyProjectWithAllTasks.updateTasksArr();
        if (itemType === 'checklists') dummyProjectWithAllChecklists.updateChecklistsArr();
    },
    deleteProject(project) {
        this.projectsArr = this.projectsArr.filter(elem => elem !== project);
    },
};

const dummyProjectWithAllTasks = Object.assign(Object.create(projectProto), { title: 'allTasksProject', tasks: [], updateTasksArr() {
    // projectsManager.projectsArr.map(project => project.tasks).forEach(array => array.forEach(task => this.tasks.push(task)));
    this.tasks =  projectsManager.projectsArr.reduce((accum, currValue) => {
       accum.push(...currValue.tasks);
       return accum;
    }, []);
} });
projectsManager.dummyProjectsArr.push(dummyProjectWithAllTasks);

const dummyProjectWithAllChecklists = Object.assign(Object.create(projectProto), { title: 'allChecklistsProject', checklists: [], updateChecklistsArr() {
    // projectsManager.projectsArr.map(project => project.checklists).forEach(array => array.forEach(checklist => this.checklists.push(checklist)));
    this.checklists =  projectsManager.projectsArr.reduce((accum, currValue) => {
       accum.push(...currValue.checklists);
       return accum;
    }, []);
} });
projectsManager.dummyProjectsArr.push(dummyProjectWithAllChecklists);

const createProject = (title) => {
    return Object.assign(Object.create(projectProto), { title, notes: [], tasks: [], checklists: [] })
};

const createNote = (title, description) => ({ title, description });

const createTask = (title, description, importance, dueDate, completed = false) => ({ title, description, importance, dueDate: formatForDateInput(dueDate), completed });

const createListItem = (title, completed = false) => ({ title, completed });

function processListItemsToObjects(arr) {
    if (arr.length < 1) return [];
    return arr.map(item => createListItem(item));
};

const createChecklist = (title, dueDate, listItems, completed = false) => {

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
newProject.addTask(createTask('Task 1', 'description', 'High', new Date(), true));
newProject.addChecklist(createChecklist('Checklist 1', new Date(), ['Item 1', 'Item 2']));

newProject2.addNote(createNote('Note 2 title', 'description'));
newProject2.addNote(createNote('Note 3 title', 'Other description'));
newProject2.addTask(createTask('Task 2', 'description', 'High', new Date()));
newProject2.addChecklist(createChecklist('Checklist 2', new Date(), ['Item 2', 'Item 3']));
newProject2.addTask(createTask('Task new', 'fff', 'High', new Date()));


const newProject3 = createProject('Project 2');
projectsManager.addProject(newProject3);
newProject3.addNote(createNote('Note 3 title', 'description'));
newProject3.addTask(createTask('Task 3', 'description', 'High', new Date()));
newProject3.addChecklist(createChecklist('Checklist 3', new Date(), ['Item 2', 'Item 3']));

console.log(newProject);
console.log(projectsManager);
// move example
// projectsManager.moveProjectItem('notes', 0, 0, 1);
// console.log(projectsManager);


// const task1 = newProject.tasks[0];
// console.log(task1);
// projectsManager.moveItemToProject('tasks', task1, 1);
// console.log(projectsManager);


export { projectsManager, createProject, createNote, createTask, createChecklist, createListItem };

