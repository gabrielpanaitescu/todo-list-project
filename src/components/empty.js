const viewTaskContainer = createDivContainer('modal-container', '', tasksList);
const openViewTaskModal = createButton('View details', 'open-modal-button', '', viewTaskContainer);
const viewTaskModal = document.createElement('dialog');
viewTaskContainer.appendChild(viewTaskModal);
createTextElem('p', 'Title: ' + task.title, viewTaskModal);
createTextElem('p', 'Description: ' + task.description, viewTaskModal);
const closeViewTaskModalBtn = createButton('Close', 'cancel-button', '', viewTaskModal);

const editTaskContainer = createDivContainer('modal-container', '', tasksList);
const openEditTaskModal = createButton('Edit task', 'open-modal-button', '', editTaskContainer);
const editTaskModal = document.createElement('dialog');
editTaskContainer.appendChild(editTaskModal);
const editTaskForm = document.createElement('form');
editTaskForm.method = 'dialog';
createLabel('editTaskTitle', 'Task title', editTaskForm);
const editTaskTitleInput = createInput('text', 'editTaskTitle', 'editTaskTitle', true, 3, editTaskForm);
createLabel('editTaskDescription', 'Task description', editTaskForm);
const editTaskDescriptionInput = createInput('textarea', 'editTaskDescription', 'editTaskDescription', true, '', editTaskForm);
const cancelEditBtn = createButton('Cancel', 'cancel-button', '', editTaskForm);
cancelEditBtn.type = 'button';
const editTaskBtn = createButton('Confirm', 'submit-button', '', editTaskForm);
editTaskModal.appendChild(editTaskForm);

const taskRemoveContainer = createDivContainer('modal-container', '', tasksList);
taskRemoveContainer.classList.add('remove-task');
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

// const editTaskBtnHandler = () => {
//     project.updateTask(task, editTaskTitleInput.value, editTaskDescriptionInput.value);
//     updateTasksDOM(project, 'tasks-list');
// };

// editTaskBtn.addEventListener('click', editTaskBtnHandler);

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
    editTaskModal.showModal();
});

cancelEditBtn.addEventListener('click', () => editTaskModal.close());

openViewTaskModal.addEventListener('click', () => viewTaskModal.showModal());

closeViewTaskModalBtn.addEventListener('click', () => viewTaskModal.close());

openTaskRemoveModal.addEventListener('click', () => taskRemoveModal.showModal());

removeTaskBtn.addEventListener('click', removeTaskBtnHandler);

cancelTaskRemoveBtn.addEventListener('click', () => taskRemoveModal.close());