import {elements} from './base';

export const renderProject = project => {
    const markup = `
    <div class="project-item-container" data-projectid="${project.id}">
        <div class="view-1">
            <i class="fas fa-chevron-right"></i>
            <div class="click-proj">
                <div class="shortcut-text proj-name">${project.name}</div>
                ${renderNumTasks(project.taskList.tasks)}
            </div>
        </div>

        <div class="view-2" data-viewid="${project.id}"></div>
    </div>
    `;

    elements.projectList.insertAdjacentHTML('beforeend', markup);
};

const renderNumTasks = taskArray => {
    const numTasks = taskArray.length;
    let markup = '';
    if (numTasks > 0) {
        markup = `
            <div class="task-num-style proj-task-num">${numTasks}</div>
        `;
    }
    return markup;
};

export const renderProjectTasks = (taskArray, projectID) => {
    const dropdownView = document.querySelector(`[data-viewid="${projectID}"]`);

    dropdownView.innerHTML = '';

    taskArray.forEach(task => {
        const markup = `
        <div class="proj-items shortcut-text" data-taskid="${task.id}">${task.title}</div>
        `;
        dropdownView.insertAdjacentHTML('beforeend', markup);
    });
};

export const isExpanded = projectID => {
    const dropdownView = document.querySelector(`[data-viewid="${projectID}"]`);
    if (dropdownView.innerHTML !== '') {
        return true;
    } else {
        return false;
    }
};

export const hideTasks = projectID => {
    const dropdownView = document.querySelector(`[data-viewid="${projectID}"]`);
    dropdownView.innerHTML = '';
};

export const renderSavedProjects = projArray => {
    projArray.forEach(proj => renderProject(proj));
};

export const transformArrow = arrow => {
    arrow.classList.toggle('rotate');
};
