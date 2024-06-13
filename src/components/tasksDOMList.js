import { createTextElem, createDivContainer, createButton, createLabel, createInput } from './DOMElementCreationMethods.js';
import './tasksDOMListStyle.css'
import { format } from "date-fns";

export default function updateTasksDOM(tasks, appendToID) {
    const tasksList = document.getElementById(appendToID);
    tasksList.replaceChildren();
    tasks.forEach((task, index) => {
        const taskWrapper = createDivContainer('task-wrapper', '', tasksList);
        createTextElem('h4', task.title, taskWrapper);
        createTextElem('p', task.description, taskWrapper);
        createTextElem('p', `Importance: ${task.importance}`, taskWrapper);
        const formattedDate = format(task.dueDate, 'MM/dd/yyyy');
        createTextElem('p', `Due date: ${formattedDate}`, taskWrapper);
    });

    
}