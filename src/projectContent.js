import {elements} from './base';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isYesterday from 'date-fns/isYesterday';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import addMinutes from 'date-fns/addMinutes'

export const renderProjectTitle = projectName => {
    elements.titleBtns.innerHTML = '';

    elements.mainTitle.textContent = projectName;
    elements.titleBtns.innerHTML = `
    <i class="far fa-edit proj-edit-btn"></i>
    <i class="far fa-trash-alt proj-trash-btn"></i>
    `;
};

export const renderTasks = (taskArray, shortcut) => {

    elements.taskList.innerHTML = '';

    taskArray.forEach(task => {
        const markup = `
        <div class="tasks underline-gray ${persistDone(task.isDone)}" data-taskid="${task.id}" data-projectname="${task.projectName}">
            <div class="tasks-left ${persistLine(task.isDone)}">

                <div class="pretty p-default p-round">
                    <input type="checkbox" class="checkbox" ${persistCheck(task.isDone)}>
                    <div class="state ${setCheckBoxColor(task.priority)}">
                        <label></label>
                    </div>
                </div>

                <p class="task-name shortcut-text ${setFontColor(task.priority)}">${task.title}</p>
                <div class="time-remaining ${persistLine(task.isDone)}">Due ${calculateTime(task.dueDate)}</div>
            </div>
            <div class="tasks-right">
                ${renderProjectName(shortcut, task.projectName)}
                <i class="far fa-edit task-edit-btn"></i>
                <i class="far fa-trash-alt task-trash-btn"></i>
            </div>
        </div>
        `;
          
        elements.taskList.insertAdjacentHTML('beforeend', markup);
    });
};

const renderProjectName = (shortcut, name) => {
    let markup = '';
    if (shortcut) {
        markup = `<p class="task-proj-name">${name}</p>`;
    }
    return markup;
};

const calculateTime = dueDate => {

    const oldDate = new Date(dueDate);
    const offset = new Date().getTimezoneOffset(); // 420 minutes / 7 hrs
    const newDate = addMinutes(oldDate, offset);

    if (isToday(newDate)) {
        return 'Today'
    } else if (isTomorrow(newDate)) {
        return 'Tomorrow'
    } else if (isYesterday(newDate)) {
        return 'Yesterday'
    } else {
        const time = formatDistanceToNow(newDate, {addSuffix: true});
        return time
    }
};

export const clearPage = () => {
    elements.mainTitle.textContent = '';
    elements.titleBtns.innerHTML = '';
    elements.taskList.innerHTML = '';
};

export const clearContents = () => {
    elements.taskList.innerHTML = '';
};

export const renameProject = newName => {
    elements.mainTitle.textContent = newName;
};

export const removeTask = taskid => {
    const el = elements.taskList.querySelector(`[data-taskid="${taskid}"]`);
    el.parentElement.removeChild(el);
};

export const editTask = (taskid, title, dueDate, priority, isDone) => {
    const parentElement = elements.taskList.querySelector(`[data-taskid="${taskid}"]`);
    const titleElement = parentElement.querySelector('.task-name');
    const dateElement = parentElement.querySelector('.time-remaining');
    const checkBoxColor = parentElement.querySelector('.state');

    if (title) {
        titleElement.textContent = title;
    }
    if (dueDate) {
        dateElement.textContent = `Due ${calculateTime(dueDate)}`;
    }
    if (priority) {
        titleElement.classList.remove('danger');
        titleElement.classList.remove('primary');

        if (priority === 'high') {
            titleElement.classList.add('danger');
        } else if (priority === 'medium') {
            titleElement.classList.add('primary');
        }

        if (isDone) {
            const color = setCheckBoxColor(priority);
            checkBoxColor.classList.remove('p-danger-o');
            checkBoxColor.classList.remove('p-primary-o');

            checkBoxColor.classList.add(color);
        }
    }
};

export const toggleCheck = (taskid, isChecked) => {
    const parentElement = elements.taskList.querySelector(`[data-taskid="${taskid}"]`);
    const checkBox = parentElement.querySelector('.checkbox');
    const tasksLeft = parentElement.querySelector('.tasks-left');
    const time = parentElement.querySelector('.time-remaining');

    if (isChecked) {
        checkBox.checked = true;
        tasksLeft.classList.add('finished');
        time.classList.add('finished');
        parentElement.classList.add('done');
    } else {
        checkBox.checked = false;
        tasksLeft.classList.remove('finished');
        time.classList.remove('finished');
        parentElement.classList.remove('done');
    }
};

export const getListOrder = () => {
    const tasks = Array.from(elements.taskList.querySelectorAll('.tasks'));
    const ids = tasks.map(task => task.dataset.taskid);
    return ids;
};

const persistCheck = isDone => {
    let markup = '';
    if (isDone) {
        markup = 'checked';
    }
    return markup;
};

const persistLine = isDone => {
    let markup = '';
    if (isDone) {
        markup = 'finished';
    }
    return markup;
};

const persistDone = isDone => {
    let markup = '';
    if (isDone) {
        markup = 'done';
    }
    return markup;
};

const setCheckBoxColor = priority => {
    let markup = '';
    if (priority === 'high') {
        markup = 'p-danger-o';
    } else if (priority === 'medium') {
        markup = 'p-primary-o';
    }
    return markup;
};

const setFontColor = priority => {
    let markup = '';
    if (priority === 'high') {
        markup = 'danger';
    } else if (priority === 'medium') {
        markup = 'primary';
    }
    return markup;
};

export const applyActive = taskid => {
    removeActive();

    const taskDOM = elements.taskList.querySelector(`[data-taskid="${taskid}"]`);
    const name = taskDOM.querySelector('.task-name');
    const time = taskDOM.querySelector('.time-remaining');

    taskDOM.classList.add('highlight-task');
    name.classList.add('bold');
    time.classList.add('bold');
};

export const removeActive = () => {
    const allTasks = Array.from(document.querySelectorAll('.tasks'));
    const allNames = Array.from(document.querySelectorAll('.task-name'));
    const allTimes = Array.from(document.querySelectorAll('.time-remaining'));

    allTasks.forEach(task => task.classList.remove('highlight-task'));
    allNames.forEach(name => name.classList.remove('bold'));
    allTimes.forEach(time => time.classList.remove('bold'));
};