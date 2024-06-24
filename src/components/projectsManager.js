import { format, isToday, isThisWeek } from 'date-fns';
import { updateLocalStorage } from './localStorageManager';

const projectsManager = {
    projectsArr: [],
    dummyProjectsArr: [],
    addProject(projectObj) {
        // if (this.projectsArr.find((item) => item.title === projectObj.title)) {
        //     alert('Project with this title already exists! Choose another title');
        //     throw Error('Project with this name already exists');
        // }
        this.projectsArr.push(projectObj);
        updateLocalStorage();
    },
    findOriginProject(itemType, item) {
        return this.projectsArr
        .find(project => project[itemType]
        .find(elem => elem === item));
    },
    refreshDummyProjectsArrays(itemType) {
        if (itemType) {
            if (itemType === 'tasks') {
                allTasksDummyProject.updateTasksArr();
                todaysTasksDummyProject.filterTodaysTasks(); 
                thisWeekTasksDummyProject.filterThisWeekTasks();   
            } else  if (itemType === 'checklists') {
                allChecklistsDummyProject.updateChecklistsArr();
                todaysChecklistsDummyProject.filterTodaysChecklists();   
                thisWeekChecklistsDummyProject.filterThisWeekChecklists();  
            }
        // in case argument is not passed, refresh anyway; the argument is used only to
        } else {
            allTasksDummyProject.updateTasksArr();
            allChecklistsDummyProject.updateChecklistsArr();
            todaysTasksDummyProject.filterTodaysTasks();  
            todaysChecklistsDummyProject.filterTodaysChecklists();
            thisWeekTasksDummyProject.filterThisWeekTasks(); 
            thisWeekChecklistsDummyProject.filterThisWeekChecklists();
        }
    },
    moveItemToProject(itemType, item, targetProjectIndex) {
        const targetProject = this.projectsArr[targetProjectIndex];
        const originProject = this.findOriginProject(itemType, item);
        originProject[itemType] = originProject[itemType].filter(elem => elem !== item);
        targetProject[itemType].push(item);
        // no update required to dummy projects as the change happens to an element inside the task component; updating the array will only change the order of the tasks upon moving action, as the tasks at the moment of writing this comment, are not sorted, but created and appended in the order of the projectsArray looping, from first created to last
        updateLocalStorage();
    },
    removeItemFromProject(itemType, item) {
        const originProject = this.findOriginProject(itemType, item);
        originProject.removeItem(itemType, item);

        // update dummy projects that contains all tasks/checklists in order to reflect the change when the quick nav buttons (ex All items) are used; this method will remove the project within the projectsManager.projectArr, and then the dummy project will get/refresh the updated list
        this.refreshDummyProjectsArrays();
        updateLocalStorage();
    },
    deleteProject(project) {
        this.projectsArr = this.projectsArr.filter(elem => elem !== project);
        updateLocalStorage();
    },
};

const projectProto = {
    addNote(noteObj)  {
        this.notes.push(noteObj);
        updateLocalStorage();
    },
    addTask(taskObj)  {
        this.tasks.push(taskObj);
        updateLocalStorage();
    },
    addChecklist(checklistObj)  {
        this.checklists.push(checklistObj);
        updateLocalStorage();
    },
    removeItem(itemType, item) {
        this[itemType] = this[itemType].filter(elem => elem !== item);
    },
    editNote(note, title, description) {
        const noteIndex = this.notes.indexOf(note);
        const targetNote = this.notes[noteIndex] 
        targetNote.title = title;
        targetNote.description = description;
        updateLocalStorage();
    },
    editTask(task, title, description, importance, dueDate) {
        const taskIndex = this.tasks.indexOf(task);
        const targetTask = this.tasks[taskIndex];
        targetTask.title = title;
        targetTask.description = description;
        targetTask.importance = importance;
        targetTask.dueDate = formatForDateInput(dueDate);
        projectsManager.refreshDummyProjectsArrays();
        updateLocalStorage();
    },
    editChecklist(checklist, title, dueDate, listItems) {
        const checklistIndex = this.checklists.indexOf(checklist);
        const targetChecklist = this.checklists[checklistIndex];
        targetChecklist.title = title;

        if (!dueDate) {
            targetChecklist.dueDate = null;
        } else if (dueDate) {
            targetChecklist.dueDate = formatForDateInput(dueDate);
        }

        targetChecklist.listItems = listItems;

        const areAllItemsChecked = targetChecklist.listItems.every(item => item.completed === true);
        if (areAllItemsChecked) {
            targetChecklist.completed = true;
        } else {
            targetChecklist.completed = false;
        }

        projectsManager.refreshDummyProjectsArrays();
        updateLocalStorage();
    },
    editProjectTitle(title) {
        this.title = title;
        updateLocalStorage();
    },
    switchItemCompletion(itemType, item, boolean) {
        this[itemType].find(elem => elem === item).completed = boolean;
        updateLocalStorage();
    }
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

// Not using allTasksDummyProject as prototype: Using a new object with projectProto because Object.create() will create an inheritance chain and any method used on the allTasksDummyProject object will affect the object created with Object.create(). This instead will create a new object with the same properties (arrays and methods) but they don't point to the original object 
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

const thisWeekTasksDummyProject = Object.assign(Object.create(projectProto), allTasksDummyProject, 
{
    title: 'thisWeekTasksProject',
    filterThisWeekTasks() {
        this.updateTasksArr();
        this.tasks = this.tasks.filter(task => isThisWeek(task.dueDate, { weekStartsOn: 1 }));
    },
});
projectsManager.dummyProjectsArr.push(thisWeekTasksDummyProject);

const createProject = (title) => {
    return Object.assign(Object.create(projectProto), { title, notes: [], tasks: [], checklists: [] })
};

const thisWeekChecklistsDummyProject = Object.assign(Object.create(projectProto), allChecklistsDummyProject, 
{
    title: 'thisWeekChecklistsProject',
    filterThisWeekChecklists() {
        this.updateChecklistsArr();
        this.checklists = this.checklists.filter(checklist => isThisWeek(checklist.dueDate, { weekStartsOn: 1 }));
    },
});
projectsManager.dummyProjectsArr.push(thisWeekChecklistsDummyProject);

const createNote = (title, description) => ({ title, description });

const createTask = (title, description, importance, dueDate, completed = false) => ({ title, description, importance, dueDate: formatForDateInput(dueDate), completed });

const createListItem = (title, completed = false) => ({ title, completed });

function processListItemsToObjects(arr) {
    if (arr.length < 1) return [];
    return arr.map(item => createListItem(item));
};

const createChecklist = (title, dueDate, listItems, completed = false) => {

    listItems = processListItemsToObjects(listItems);

    if (!dueDate) {
        dueDate = null;
    } else if (dueDate) {
        dueDate = formatForDateInput(dueDate);
    } 

    return { title, dueDate, listItems, completed };
};

function formatForDateInput(date) {
    return format(date, 'yyyy-MM-dd');
}

const createDefaultProject = () => {
    const defaultProject = createProject('Personal');
    defaultProject.notes[0] = createNote('This is the default Project', 'You can edit, delete or move anything inside this Project');
    defaultProject.tasks[0] = createTask('Task example', 'Press the Add  button in order to create a new item', 'Low', new Date('2000-01-01'), false);
    defaultProject.checklists[0] = createChecklist('Click the Expand button to view list items', '', ['Item 1', 'Item 2', 'Item 3'], false);
    return defaultProject;
};

export { projectsManager, projectProto, createProject, createNote, createTask, createChecklist, createListItem, createDefaultProject };

