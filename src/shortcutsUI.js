import {elements} from './base';

export const renderTitle = option => {
    elements.titleBtns.innerHTML = '';
    if (option === 'today') {
        elements.mainTitle.textContent = 'Today';
    } else {
        elements.mainTitle.textContent = 'Next 7 Days';
    }
};

export const renderNumTasks = (todayCount, weekCount) => {
    elements.todayCount.textContent = todayCount;
    elements.weekCount.textContent = weekCount;

    if (todayCount > 0) {
        elements.todayCount.style.visibility = 'visible';
    } else {
        elements.todayCount.style.visibility = 'hidden';
    }

    if (weekCount > 0) {
        elements.weekCount.style.visibility = 'visible';
    } else {
        elements.weekCount.style.visibility = 'hidden';
    }
};

export const updateProjectInfo = (taskid, name) => {
    const parentElement = elements.taskList.querySelector(`[data-taskid="${taskid}"]`);
    parentElement.dataset.projectname = name;

    const projectName = parentElement.querySelector('.task-proj-name');
    projectName.textContent = name;
};