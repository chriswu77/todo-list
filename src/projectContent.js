import {elements} from './base';
import isToday from 'date-fns/isToday';
import isTomorrow from 'date-fns/isTomorrow';
import isYesterday from 'date-fns/isYesterday';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

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
        <div class="tasks underline-gray" data-taskid="${task.id}" data-projectname="${task.projectName}">
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
        titleElement.classList.remove('warning');
        titleElement.classList.remove('primary');

        if (priority === 'high') {
            titleElement.classList.add('danger');
        } else if (priority === 'medium') {
            titleElement.classList.add('warning');
        } else {
            titleElement.classList.add('primary');
        }

        if (isDone) {
            const color = setCheckBoxColor(priority);
            checkBoxColor.classList.remove('p-danger-o');
            checkBoxColor.classList.remove('p-warning-o');
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
    } else {
        checkBox.checked = false;
        tasksLeft.classList.remove('finished');
        time.classList.remove('finished');
    }
};

export const getListOrder = () => {
    const tasks = Array.from(elements.taskList.querySelectorAll('.tasks'));
    const ids = tasks.map(task => task.dataset.taskid);
    return ids;
    // console.log(ids);
    // console.log(tasks);
};

const persistCheck = isDone => {
    if (isDone) {
        return 'checked'
    }
};

const persistLine = isDone => {
    if (isDone) {
        return 'finished'
    }
};

const setCheckBoxColor = priority => {
    let markup;
    if (priority === 'high') {
        markup = 'p-danger-o';
    } else if (priority === 'medium') {
        markup = 'p-warning-o';
    } else {
        markup = 'p-primary-o';
    }
    return markup;
};

const setFontColor = priority => {
    let markup;
    if (priority === 'high') {
        markup = 'danger';
    } else if (priority === 'medium') {
        markup = 'warning';
    } else {
        markup = 'primary';
    }
    return markup;
};