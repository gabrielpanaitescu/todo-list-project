import { createTextElem, createDivContainer, createButton, createLabel, createInput, createImportanceSelectElem } from './DOMElementCreationMethods.js';
import { format } from "date-fns";

export default function updateTasksDOM(project, appendToID) {
    const tasksList = document.getElementById(appendToID);
    tasksList.replaceChildren();

    project.tasks.forEach((task) => {
        const taskWrapper = document.createElement('li');
        taskWrapper.classList.add('task-item');
        tasksList.appendChild(taskWrapper);
        
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
        const openEditTaskModal = createButton('View/Edit', 'open-modal-button', '', editTaskContainer);
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
        const editTaskInputsArr = document.querySelectorAll('.edit-task-modal input');

        const taskRemoveContainer = createDivContainer('modal-container', '', taskWrapper);
        taskRemoveContainer.classList.add('remove-task-modal');
        const openTaskRemoveModal = createButton('x', 'open-modal-button', '', taskRemoveContainer);
        const taskRemoveModal = document.createElement('dialog');
        taskRemoveContainer.appendChild(taskRemoveModal);
        createTextElem('p', 'Are you sure you want to delete this task?', taskRemoveModal);
        const cancelTaskRemoveBtn = createButton('Cancel', 'cancel-button', '', taskRemoveModal);
        const removeTaskBtn = createButton('Confirm', 'submit-button', '', taskRemoveModal);
 

        const removeTaskBtnHandler = () => {
            project.removeItem('tasks', task);
            updateTasksDOM(project, 'tasks-list');
        };
    
        const editTaskBtnHandler = () => {
            if (!editTaskForm.checkValidity()) return;

            project.editTask(task, editTaskTitleInput.value, editTaskDescriptionInput.value, editTaskImportanceSelect.value, editTaskDuedateInput.value);
            updateTasksDOM(project, 'tasks-list');
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
            if (taskCompletionCheckbox.checked) task.completed = true;
            if (!taskCompletionCheckbox.checked) task.completed = false;
        };

        taskCompletionCheckbox.addEventListener('click', taskCompletionCheckboxHandler);
    
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