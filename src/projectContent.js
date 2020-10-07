import {elements} from './base';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isYesterday from 'date-fns/isYesterday';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import isThisWeek from 'date-fns/isThisWeek';

export const renderProjectTitle = projectName => {
    elements.titleBtns.innerHTML = '';

    elements.mainTitle.textContent = projectName;
    elements.titleBtns.innerHTML = `
    <i class="far fa-edit proj-edit-btn"></i>
    <i class="far fa-trash-alt proj-trash-btn"></i>
    `;
};

export const renderTasks = taskArray => {

    elements.taskList.innerHTML = '';

    taskArray.forEach(task => {
        const markup = `
        <div class="tasks underline-gray" data-taskid="${task.id}">
            <div class="tasks-left">
                <input type="checkbox" class="checkbox" ${persistCheck(task.isDone)}>
                <p class="task-name shortcut-text">${task.title}</p>
                <div class="time-remaining">Due ${calculateTime(task.dueDate)}</div>
            </div>
            <div class="tasks-right">
                <i class="far fa-edit task-edit-btn"></i>
                <i class="far fa-trash-alt task-trash-btn"></i>
            </div>
        </div>
        `;
          
        elements.taskList.insertAdjacentHTML('beforeend', markup);
    });
};

const calculateTime = dueDate => {
    if (isToday(new Date(dueDate))) {
        return 'Today'
    } else if (isTomorrow(new Date(dueDate))) {
        return 'Tomorrow'
    } else if (isYesterday(new Date(dueDate))) {
        return 'Yesterday'
    } else {
        const time = formatDistanceToNow(new Date(dueDate), {addSuffix: true});
        return time
    }
};

export const clearPage = () => {
    elements.mainTitle.textContent = '';
    elements.titleBtns.innerHTML = '';
    elements.taskList.innerHTML = '';
};

export const renameProject = newName => {
    elements.mainTitle.textContent = newName;
};

export const removeTask = taskid => {
    const el = elements.taskList.querySelector(`[data-taskid="${taskid}"]`);
    el.parentElement.removeChild(el);
};

export const editTask = (taskid, title, dueDate) => {
    const parentElement = elements.taskList.querySelector(`[data-taskid="${taskid}"]`);
    const titleElement = parentElement.querySelector('.task-name');
    const dateElement = parentElement.querySelector('.time-remaining');

    if (title) {
        titleElement.textContent = title;
    }
    if (dueDate) {
        dateElement.textContent = `Due ${calculateTime(dueDate)}`;
    }
};

export const toggleCheck = (taskid, isChecked) => {
    const parentElement = elements.taskList.querySelector(`[data-taskid="${taskid}"]`);
    const checkBox = parentElement.querySelector('.checkbox');

    if (isChecked) {
        checkBox.checked = true;
    } else {
        checkBox.checked = false;
    }
};

const persistCheck = isDone => {
    if (isDone) {
        return 'checked'
    }
};