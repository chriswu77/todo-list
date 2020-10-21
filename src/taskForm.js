import {elements} from './base';

export const renderForm = (btn, projNamesArr, task) => {
    elements.modal.style.visibility = 'visible';
    elements.modalContent.innerHTML = getFormHTML(btn, projNamesArr, task);
    // set up exit form event listeners
    document.querySelector('.cancel-btn').addEventListener('click', exitForm);
    window.addEventListener('click', e => {
        if (e.target.matches('.modal')) {
            exitForm();
        }
    });
};

export const exitForm = () => {
    elements.modal.style.visibility = 'hidden';
};

export const getInputs = () => {
    const priorityListDOM = document.querySelector('#select-priority');
    const projectListDOM = document.querySelector('#select-project');
    return {
        title: document.querySelector('#task-title').value,
        description: document.querySelector('#task-description').value,
        dueDate: document.querySelector('#task-due-date').value,
        priority: priorityListDOM.options[priorityListDOM.selectedIndex].value,
        project: projectListDOM.options[projectListDOM.selectedIndex].value,
        notes: document.querySelector('#task-form-notes').value
    }
};

export const validateForm = () => {
    const priorityListDOM = document.querySelector('#select-priority');
    const projectListDOM = document.querySelector('#select-project');
    const submitBtn = document.querySelector('.submit-btn');

    let title = document.querySelector('#task-title').value;
    let dueDate = document.querySelector('#task-due-date').value;
    let priority = priorityListDOM.options[priorityListDOM.selectedIndex].value;
    let project = projectListDOM.options[projectListDOM.selectedIndex].value;

    if (title !== '' && dueDate !== '' && priority !== '' && project !== '') {
        //apply active state css
        submitBtn.setAttribute('style', 'opacity: 1; border: 1.75px solid #5898DD;');
    } else {
        // grey it out
        submitBtn.setAttribute('style', 'opacity: 0.25');
    }
};

const getFormHTML = (btn, projNamesArr, task) => {
    let markup;
    if (btn === 'add') {
        markup = `
        <form class="add-task-form">
            <input id="task-title" type="text" placeholder="Task Title" required>
            <div class="task-form-spacing">
                <input id="task-description" type="text" placeholder="Description">
            </div>
            <div class="task-form-spacing">
                <input id="task-due-date" type="date" required>
            </div>
            <div class="task-form-spacing">
                <select id="select-priority" name="priority" required>
                    <option value="" hidden disabled selected>Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <div class="task-form-spacing">
                <select id="select-project" name="project" required>
                    ${renderProjectList(projNamesArr)}
                </select>
            </div>
            <div class="task-form-spacing">
                <textarea id="task-form-notes" name="notes" placeholder="Notes" rows="5" cols="50"></textarea>
            </div>
            <div class="btn-container-2">
                <input type="button" class="cancel-btn" value="Cancel">
                <input type="submit" class="submit-btn" value="Submit">
            </div>
        </form>
        `;
    } else {
        markup = `
        <form class="add-task-form">
            <input id="task-title" type="text" placeholder="Task Title" value="${task.title}" required>
            <div class="task-form-spacing">
                <input id="task-description" type="text" placeholder="Description" value="${task.description}">
            </div>
            <div class="task-form-spacing">
                <input id="task-due-date" type="date" value="${task.dueDate}" required>
            </div>
            <div class="task-form-spacing">
                <select id="select-priority" name="priority" required>
                    ${setPriorityHTML(task.priority)}
                </select>
            </div>
            <div class="task-form-spacing">
                <select id="select-project" name="project" required>
                    ${renderProjectList(projNamesArr, task.projectName)}
                </select>
            </div>
            <div class="task-form-spacing">
                <textarea id="task-form-notes" name="notes" placeholder="Notes" rows="5" cols="50" value="${task.notes}">${task.notes}</textarea>
            </div>
            <div class="btn-container-2">
                <input type="button" class="cancel-btn" value="Cancel">
                <input type="submit" class="submit-btn" value="Submit">
            </div>
        </form>
        `;
    }
    return markup;
};

const setPriorityHTML = priority => {
    let markup;
    if (priority === 'high') {
        markup = `
        <option value="high" selected>High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        `;
    } else if (priority === 'medium') {
        markup = `
        <option value="high">High</option>
        <option value="medium" selected>Medium</option>
        <option value="low">Low</option>
        `; 
    } else {
        markup = `
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low" selected>Low</option>
        `; 
    }
    return markup;
};

const renderProjectList = (projectNames, currentProject) => {
    let markup;
    if (currentProject === undefined) {
        const openContentProj = elements.mainTitle.textContent;
        if (projectNames.includes(openContentProj)) {
            // set the selected value to current project open in content page if there is one
            markup = `
            ${getProjNamesHTML(projectNames, openContentProj)}
            `;
        } else {
            markup = `
            <option value="" hidden disabled selected>Select Project</option>
            ${getProjNamesHTML(projectNames)}
            `;
        }
    } else {
        markup = `
        ${getProjNamesHTML(projectNames, currentProject)}
        `;
    }
    return markup;
};

const getProjNamesHTML = (projectNames, currentProject) => {
    let markup = '';
    if (currentProject === undefined) {
        for (let i = 0; i < projectNames.length; i++) {
            markup += `<option value="${projectNames[i]}">${projectNames[i]}</option>`;
        }
    } else {
        for (let i = 0; i < projectNames.length; i++) {
            if (projectNames[i] === currentProject) {
                markup += `<option value="${projectNames[i]}" selected>${projectNames[i]}</option>`;
            } else {
                markup += `<option value="${projectNames[i]}">${projectNames[i]}</option>`;
            }
        }
    }
    return markup;
};