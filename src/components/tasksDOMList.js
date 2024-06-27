import { createTextElem, createDivContainer, createButton, createLabel, createInput, createImportanceSelectElem } from './DOMElementCreationMethods';
import { format } from 'date-fns';
import { projectsManager } from './projectsManager';

export default function updateTasksDOM(project, IDtoAppend) {
    const tasksList = document.getElementById(IDtoAppend);
    tasksList.replaceChildren();

    if (project.tasks.length < 1) {
        createTextElem('h4', 'No tasks found', tasksList);
        return;
    }

    project.tasks.forEach((task) => {
        const taskWrapper = document.createElement('li');
        taskWrapper.classList.add('task-item');
        tasksList.appendChild(taskWrapper);

        switch (task.completed) {
            case true: 
                taskWrapper.classList.add('completed-task');
                break;
            case false: 
                taskWrapper.classList.remove('completed-task');
                break;
            default:
                console.log('Task completion is neither true nor false');
        };
        
        const taskCompletionCheckbox = createInput('checkbox', '', '', '', '', taskWrapper);
        taskCompletionCheckbox.classList.add('completion-checkbox');
        if (task.completed) taskCompletionCheckbox.checked = true;

        createTextElem('h4', task.title, taskWrapper);
        createTextElem('p', task.description, taskWrapper);
        createTextElem('p', `Importance: ${task.importance}`, taskWrapper);
        const formattedDateForDisplay = format(task.dueDate, 'MM/dd/yyyy');
        createTextElem('p', `Due date: ${formattedDateForDisplay}`, taskWrapper);
    
        const editTaskContainer = createDivContainer('modal-container', '', taskWrapper);
        editTaskContainer.classList.add('edit-task-modal');
        editTaskContainer.classList.add('edit-container');
        const openEditTaskModal = createButton('Expand', 'open-modal-button', '', editTaskContainer);
        const editTaskModal = document.createElement('dialog');
        editTaskContainer.appendChild(editTaskModal);
        const editTaskForm = document.createElement('form');
        editTaskForm.method = 'dialog';
        createLabel('editTaskTitle', 'Task title', editTaskForm);
        const editTaskTitleInput = createInput('text', 'editTaskTitle', 'editTaskTitle', true, '', editTaskForm);
        createLabel('editTaskDescription', 'Task description', editTaskForm);
        const editTaskDescriptionInput = createInput('textarea', 'editTaskDescription', 'editTaskDescription', true, '', editTaskForm);
        createLabel('editTaskImportance', 'Importance', editTaskForm);
        const editTaskImportanceSelect = createImportanceSelectElem('editTask', editTaskForm);
        createLabel('editTaskDueDate', 'Due date: ', editTaskForm);
        const editTaskDuedateInput = createInput('date', 'editTaskDueDate', 'editTaskDueDate', true, '', editTaskForm);
        const cancelEditBtn = createButton('Cancel', 'cancel-button', '', editTaskForm);
        cancelEditBtn.type = 'button';
        const editTaskBtn = createButton('Confirm', 'submit-button', '', editTaskForm);
        editTaskModal.appendChild(editTaskForm);
        const editTaskInputsArr = editTaskForm.querySelectorAll('input');

        const moveTaskContainer = createDivContainer('move-item-container', '', taskWrapper);
        createLabel('move-task', 'Move: ', moveTaskContainer);
        const moveTaskSelect = document.createElement('select');
        moveTaskSelect.classList.add('move-item');
        moveTaskSelect.id = 'move-task';
        moveTaskContainer.appendChild(moveTaskSelect);
        projectsManager.projectsArr.forEach((projectObj, index) => {
            const moveTaskOption = document.createElement('option');
            moveTaskOption.value = projectObj.title;
            const originProject = projectsManager.findOriginProject('tasks', task);
            if (originProject.title === projectObj.title) moveTaskOption.setAttribute('selected', '');
            if (moveTaskOption.selected) moveTaskOption.setAttribute('disabled', '');
            moveTaskOption.dataset.projectIndex = index;
            moveTaskOption.textContent = projectObj.title; 
            moveTaskSelect.appendChild(moveTaskOption);
        });

        const taskRemoveContainer = createDivContainer('modal-container', '', taskWrapper);
        taskRemoveContainer.classList.add('remove-task-modal');
        const openTaskRemoveModal = createButton('x', 'open-modal-button', '', taskRemoveContainer);
        const taskRemoveModal = document.createElement('dialog');
        taskRemoveContainer.appendChild(taskRemoveModal);
        createTextElem('p', 'Are you sure you want to delete this task?', taskRemoveModal);
        const cancelTaskRemoveBtn = createButton('Cancel', 'cancel-button', '', taskRemoveModal);
        const removeTaskBtn = createButton('Confirm', 'submit-button', '', taskRemoveModal);
 
        const removeTaskBtnHandler = () => {
            projectsManager.removeItemFromProject('tasks', task);
            updateTasksDOM(project, IDtoAppend);
        };

        const moveTaskHandler = (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            projectsManager.moveItemToProject('tasks', task, selectedOption.dataset.projectIndex);
            updateTasksDOM(project, IDtoAppend);
        };        
    
        const editTaskBtnHandler = () => {
            editTaskInputsArr.forEach(input => input.readOnly = false);

            if (!editTaskForm.checkValidity()) return;

            project.editTask(task, editTaskTitleInput.value, editTaskDescriptionInput.value, editTaskImportanceSelect.value, editTaskDuedateInput.value);
            updateTasksDOM(project, IDtoAppend);
        };

        const editTaskInputsClickHandler = (e) => {
            e.target.readOnly = false;
        };

        const editTaskInputsFocusOutHandler = (e) => {
            e.target.readOnly = true;
        }
            
        editTaskInputsArr.forEach(input => {
            input.readOnly = true;
            input.addEventListener('click', editTaskInputsClickHandler);
            input.addEventListener('focusout', editTaskInputsFocusOutHandler);
        });

        const taskCompletionCheckboxHandler = () => {
            if (taskCompletionCheckbox.checked) project.switchItemCompletion('tasks', task, true);
            if (!taskCompletionCheckbox.checked) project.switchItemCompletion('tasks', task, false);
        };

        moveTaskSelect.addEventListener('change', moveTaskHandler);

        taskCompletionCheckbox.addEventListener('click', () => {
            taskCompletionCheckboxHandler();
            // task container does not need an update, the box checking is in sync with the update of the task object; only the localStorage needs updated, but a class for styling purposes will be added or removed
            updateTasksDOM(project, IDtoAppend);
        });
    
        editTaskBtn.addEventListener('click', editTaskBtnHandler);
    
        editTaskForm.addEventListener('submit', (e) => {
            editTaskTitleInput.removeAttribute('required');
            editTaskDescriptionInput.removeAttribute('required');
            editTaskForm.reset();
            setTimeout(() => {
                editTaskTitleInput.setAttribute('required', '');
                editTaskDescriptionInput.setAttribute('required', '');
            }, 100);
        });
    
        openEditTaskModal.addEventListener('click', () => {
            editTaskTitleInput.value = task.title;
            editTaskDescriptionInput.value = task.description;
            editTaskImportanceSelect.value = task.importance;
            editTaskDuedateInput.value = task.dueDate;
            editTaskModal.showModal();
        });
    
        cancelEditBtn.addEventListener('click', () => editTaskModal.close());
    
        openTaskRemoveModal.addEventListener('click', () => taskRemoveModal.showModal());
    
        removeTaskBtn.addEventListener('click', removeTaskBtnHandler);
    
        cancelTaskRemoveBtn.addEventListener('click', () => taskRemoveModal.close());
    });
};