
// export const renderProject = project => {

// };

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

    document.getElementById('project-list').insertAdjacentHTML('beforeend', markup);
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

    taskArray.forEach(task => {
        const markup = `
        <div class="proj-items shortcut-text" data-taskid="${task.id}">${task.title}</div>
        `;
        dropdownView.insertAdjacentHTML('beforeend', markup);
    });
};

// hide tasks function

export const renderSavedProjects = projArray => {
    projArray.forEach(proj => renderProject(proj));
};