import { format, isToday, isThisWeek } from "date-fns";

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
    refreshDummyProjectsArrays(itemType) {
        if (itemType) {
            if (itemType === 'tasks') allTasksDummyProject.updateTasksArr();
            if (itemType === 'checklists') allChecklistsDummyProject.updateChecklistsArr();
            if (itemType === 'tasks') todaysTasksDummyProject.filterTodaysTasks(); 
            if (itemType === 'checklists') todaysChecklistsDummyProject.filterTodaysChecklists();   
        // in case argument is not passed, refresh anyway
        } else {
            allTasksDummyProject.updateTasksArr();
            allChecklistsDummyProject.updateChecklistsArr();
            todaysTasksDummyProject.filterTodaysTasks();  
            todaysChecklistsDummyProject.filterTodaysChecklists();
        }
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

        // update dummy projects that contains all tasks/checklists in order to reflect the change when the quick nav buttons (ex All items) are used; this method will remove the project within the projectsManager.projectArr, and then the dummy project will get/refresh the updated list
        this.refreshDummyProjectsArrays();
    },
    deleteProject(project) {
        this.projectsArr = this.projectsArr.filter(elem => elem !== project);
    },
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
        projectsManager.refreshDummyProjectsArrays();
    },
    editChecklist(checklist, title, dueDate, listItems) {
        const checklistIndex = this.checklists.indexOf(checklist);
        const targetChecklist = this.checklists[checklistIndex];
        targetChecklist.title = title;
        if (!dueDate) targetChecklist.dueDate = null;
        if (dueDate) targetChecklist.dueDate = formatForDateInput(dueDate);
        targetChecklist.listItems = listItems;
        projectsManager.refreshDummyProjectsArrays();
    },
};


const allTasksDummyProject = Object.assign(Object.create(projectProto), 
{ 
    title: 'allTasksProject', 
    tasks: [], 
    updateTasksArr() {
        // projectsManager.projectsArr.map(project => project.tasks).forEach(array => array.forEach(task => this.tasks.push(task)));
        this.tasks =  projectsManager.projectsArr.reduce((accum, currValue) => {
        accum.push(...currValue.tasks);
        return accum;
        }, []);
    },
});
projectsManager.dummyProjectsArr.push(allTasksDummyProject);

const allChecklistsDummyProject = Object.assign(Object.create(projectProto), { title: 'allChecklistsProject', checklists: [], updateChecklistsArr() {
    // projectsManager.projectsArr.map(project => project.checklists).forEach(array => array.forEach(checklist => this.checklists.push(checklist)));
    this.checklists =  projectsManager.projectsArr.reduce((accum, currValue) => {
       accum.push(...currValue.checklists);
       return accum;
    }, []);
}});
projectsManager.dummyProjectsArr.push(allChecklistsDummyProject);

// Why not using allTasksDummyProject as prototype: Using a new object with projectProto because Object.create() will create an inheritance chain and any method used on the allTasksDummyProject object will affect the object created with Object.create(). This instead will create a new object with the same properties (arrays and methods) but they don't point to the original object 
const todaysTasksDummyProject = Object.assign(Object.create(projectProto), allTasksDummyProject, 
{
    title: 'todaysTasksProject',
    filterTodaysTasks() {
        this.updateTasksArr();
        this.tasks = this.tasks.filter(task => isToday(task.dueDate));
    },
});
projectsManager.dummyProjectsArr.push(todaysTasksDummyProject);

const todaysChecklistsDummyProject = Object.assign(Object.create(projectProto), allChecklistsDummyProject, 
{
    title: 'todaysChecklistsProject',
    filterTodaysChecklists() {
        this.updateChecklistsArr();
        this.checklists = this.checklists.filter(checklist => isToday(checklist.dueDate));
    },
});
projectsManager.dummyProjectsArr.push(todaysChecklistsDummyProject);

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


export { projectsManager, createProject, createNote, createTask, createChecklist, createListItem };

