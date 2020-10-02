import ProjectList from './ProjectList';
import * as projectListView from './projectListView';
import * as projectForm from './projectForm';
import * as taskForm from './taskForm';
import * as projectContent from './projectContent';
import {elements} from './base';

/** Global state of the app
 * - Project list
 * - Add Project View Modal/Object
 * - Add task View Modal/Object
 * - Current project object with tasks
 * - Shortcuts 
 */

const state = {};

// Project List - create default project or load saved projects
window.addEventListener('load', () => {

    if (!state.projectList) state.projectList = new ProjectList();

    // check if storage has any projects
    state.projectList.readStorage();

    const numProjects = state.projectList.getNumProjects();

    if (numProjects === 0) {
        //if empty, create a default project
        const defaultProject = state.projectList.addProject("Default Project");
        projectListView.renderProject(defaultProject);
    } else {
        // render saved projects
        projectListView.renderSavedProjects(state.projectList.projects);
    }

});

/**
 * Project List Controller 
 */

// expand project to show tasks or minimize
elements.projectList.addEventListener('click', e => {
    const arrow = e.target.closest('.fa-chevron-right');
    const projectBox = e.target.closest('.click-proj');
    if (arrow) {
        controlArrow(arrow);
    } else if (projectBox) {
        controlBox(projectBox);
    }
});

const controlArrow = arrow => {
    // get the project id
    const projectID = arrow.parentElement.parentElement.dataset.projectid;

    // collapse or expand
    const expanded = projectListView.isExpanded(projectID);

    if (expanded) {
        // collapse and hide task
        projectListView.hideTasks(projectID);
        projectListView.transformArrow(arrow);
    } else {
        // check if there are any tasks in the project before expanding
        const numTasks = state.projectList.getNumTasks(projectID);

        if (numTasks > 0) {
            // render projects and transform the arrow
            const taskList = state.projectList.getTaskList(projectID);
            projectListView.renderProjectTasks(taskList.tasks, projectID);
            projectListView.transformArrow(arrow);
        }
    }
};

const controlBox = projectBox => {
    // get the project
    const projectID = projectBox.parentElement.parentElement.dataset.projectid;
    const project = state.projectList.getProject(projectID);
    const taskList = state.projectList.getTaskList(projectID);

    console.log(project);
    // render the project data in the content UI
    projectContent.renderProjectTitle(project.name);
    projectContent.renderTasks(taskList.tasks);
};

/**
 * Add Project Btn Controller
 */
elements.addProjectBtn.addEventListener('click', () => {
    // render form
    projectForm.renderForm('add');

    document.querySelector('.proj-name-input').addEventListener('keyup', projectForm.validateForm);

    const formDOM = document.getElementById('add-proj-form');
    formDOM.addEventListener('submit', e => {
        e.preventDefault();
        controlAddProjectForm();
    });
});

const controlAddProjectForm = () => {
    // get input when form submitted
    const input = projectForm.getInput();
    if (input) {
        // create a new project and render
        const newProject = state.projectList.addProject(input);
        projectListView.renderProject(newProject);
        // exit form
        projectForm.exitForm();
    }
};

/**
 * Add Task Btn Controller
 */
elements.addTaskBtn.addEventListener('click', () => {
    // render form
    const projNames = state.projectList.getProjectNames();
    taskForm.renderForm('add', state.projectList.getProjectNames());

    // add form validation event listeners
    const dueDate = document.querySelector('#task-due-date');
    const priorityListDOM = document.querySelector('#select-priority');
    const projectListDOM = document.querySelector('#select-project');
    const inputsArr = [dueDate, priorityListDOM, projectListDOM];

    document.querySelector('#task-title').addEventListener('keyup', taskForm.validateForm);
    inputsArr.forEach(input => input.addEventListener('change', taskForm.validateForm));

    // handle data on submit
    const form = document.querySelector('.add-task-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        controlAddTaskForm();
    });
});

const controlAddTaskForm = () => {
    // get data
    const data = taskForm.getInputs();
    // create a task in the selected project
    const projectID = state.projectList.getProjectID(data.project);
    const taskList = state.projectList.getTaskList(projectID);
    //addTask (title, description, dueDate, priority, projectName, notes = '', isDone = false)
    const task = taskList.addTask(data.title, data.description, data.dueDate, data.priority, data.project, data.notes);
    state.projectList.persistData();

    // update and render the task in the project list UI
    updateProjects();

    // exit form
    taskForm.exitForm();
};

const updateProjects = () => {
    state.projectList.projects.forEach(proj => {
        const taskList = state.projectList.getTaskList(proj.id);
        const expanded = projectListView.isExpanded(proj.id);

        // update the # of tasks for all projects
        projectListView.updateNumTasks(taskList.tasks, proj.id);

        // re-expand the project's tasks if it was expanded before
        if (expanded) {
            projectListView.renderProjectTasks(taskList.tasks, proj.id);
        }
    });
};

/**
 * Project Content Controller
 */

