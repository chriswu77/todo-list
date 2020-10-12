import ProjectList from './ProjectList';
import * as projectListView from './projectListView';
import * as projectForm from './projectForm';
import * as taskForm from './taskForm';
import * as projectContent from './projectContent';
import {elements} from './base';
import Sortable from "sortablejs";
import * as shortcuts from './shortcuts';
import * as shortcutsView from './shortcutsUI';
// import { MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";

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

    if (!state.moveableTaskList) state.moveableTaskList = new Sortable(elements.taskList, {
        animation: 200,
        filter: '.finished',
        onUpdate: function (/**Event*/ evt) {
            updateTasks();
          }
    });

    // check if storage has any projects
    state.projectList.readStorage();

    const numProjects = state.projectList.getNumProjects();

    if (numProjects === 0) {
        //if empty, create a default project
        const defaultProject = state.projectList.addProject("Default Project");
        projectListView.renderProject(defaultProject);
        // render the project data in the content UI
        projectContent.renderProjectTitle(defaultProject.name);
    } else {
        // render saved projects in project list
        projectListView.renderSavedProjects(state.projectList.projects);

        // render first saved project in content
        const firstProject = state.projectList.projects[0];
        const taskList = state.projectList.getTaskList(firstProject.id);
        projectContent.renderProjectTitle(firstProject.name);
        projectContent.renderTasks(taskList.tasks);
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
    taskForm.renderForm('add', projNames);

    // add form validation event listeners
    taskFormEventListeners();

    // handle data on submit
    const form = document.querySelector('.add-task-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        controlAddTaskForm();
    });
});

const taskFormEventListeners = () => {
    const dueDate = document.querySelector('#task-due-date');
    const priorityListDOM = document.querySelector('#select-priority');
    const projectListDOM = document.querySelector('#select-project');
    const inputsArr = [dueDate, priorityListDOM, projectListDOM];

    document.querySelector('#task-title').addEventListener('keyup', taskForm.validateForm);
    inputsArr.forEach(input => input.addEventListener('change', taskForm.validateForm));
};

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

    // add the task in content container if task belongs in the current open one
    updateContent(taskList, task);

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

const updateContent = (taskList, task) => {
    if (elements.mainTitle.textContent === task.projectName) {
        projectContent.renderTasks(taskList.tasks);
    }
};

/**
 * Project Content Controller
 */
// control project title 
elements.titleBtns.addEventListener('click', e => {
    const editBtn = e.target.matches('.proj-edit-btn');
    const trashBtn = e.target.matches('.proj-trash-btn');
    let projectID;

    // get projectID
    const projectName = e.target.parentElement.parentElement.firstElementChild.textContent;
    if (projectName) {
        projectID = state.projectList.getProjectID(projectName);
    }

    // control buttons
    if (editBtn) {
        controlEditBtn(projectID, projectName);
    } else if (trashBtn) {
        controlTrashBtn(projectID);
    }
});

const controlEditBtn = (id, currentName) => {
    // render the project form
    projectForm.renderForm('edit', currentName);
    document.querySelector('.proj-name-input').addEventListener('keyup', projectForm.validateForm);
    const formDOM = document.getElementById('add-proj-form');
    formDOM.addEventListener('submit', e => {
        e.preventDefault();
        controlEditProjectForm(id);
    });
};

const controlEditProjectForm = id => {
    // get input when form submitted
    const input = projectForm.getInput();
    if (input) {
        // edit the project name
        state.projectList.renameProject(id, input);
        // render new name in the title and project list UI
        projectContent.renameProject(input);
        projectListView.renameProject(id, input);
        // exit form
        projectForm.exitForm();
    }
};

const controlTrashBtn = id => {
    // remove the project from state array
    state.projectList.removeProject(id);
    // clear the content page
    projectContent.clearPage();
    // update the project list UI
    projectListView.deleteProject(id);
};

elements.taskList.addEventListener('click', e => {
    const editBtn = e.target.matches('.task-edit-btn');
    const deleteBtn = e.target.matches('.task-trash-btn');
    const checkBox = e.target.matches('.checkbox');

    // const taskID = e.target.parentElement.parentElement.dataset.taskid;
    // const projName = e.target.parentElement.parentElement.dataset.projectname;
    // const projectID = state.projectList.getProjectID(projName);
    // const taskList = state.projectList.getTaskList(projectID);
    // const task = taskList.getTask(taskID);

    if (editBtn) {
        const data = clickInfo(e, false);
        controlEditTaskBtn(data.taskList, data.task);
    } else if (deleteBtn) {
        const data = clickInfo(e, false)
        controlTaskTrashBtn(data.taskList, data.taskID, data.projectID);
    } else if (checkBox) {
        const isChecked = e.target.checked;
        const data = clickInfo(e, true);
        // const taskid = e.target.parentElement.parentElement.parentElement.dataset.taskid;
        controlCheckBox(data.taskList, data.taskid, isChecked);
    }
});

const clickInfo = (e, checked) => {
    if (!checked) {
        const taskID = e.target.parentElement.parentElement.dataset.taskid;
        const projName = e.target.parentElement.parentElement.dataset.projectname;
        const projectID = state.projectList.getProjectID(projName);
        const taskList = state.projectList.getTaskList(projectID);
        const task = taskList.getTask(taskID);
        return {
            taskID, projectID, taskList, task
        }
    } else {
        const taskid = e.target.parentElement.parentElement.parentElement.dataset.taskid;
        const projName = e.target.parentElement.parentElement.parentElement.dataset.projectname;
        const projectID = state.projectList.getProjectID(projName);
        const taskList = state.projectList.getTaskList(projectID);
        return {
            taskList, taskid
        }
    }
};

const controlEditTaskBtn = (taskList, task) => {
    // render the task form
    taskForm.renderForm('edit', state.projectList.getProjectNames(), task);
    // add form validation event listeners
    taskFormEventListeners();
    // handle data on submit
    const form = document.querySelector('.add-task-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        controlEditTaskForm(taskList, task);
    });
};

const controlEditTaskForm = (taskList, task) => {
    // get inputs
    const data = taskForm.getInputs();
    // change the data 
    //editTask (id, title, description, dueDate, priority, projectName, notes)
    const prevProject = task.projectName;
    const prevName = task.title;
    const prevDueDate = task.dueDate;
    const prevPriority = task.priority;
    taskList.editTask(task.id, data.title, data.description, data.dueDate, data.priority, data.project, data.notes);
    state.projectList.persistData();

    // render the project's tasks again in content in case task has been re-assigned to different project
    if (data.project !== prevProject) {
        projectContent.removeTask(task.id);
        moveTask(taskList, task.id);
        projectListView.renderSavedProjects(state.projectList.projects);
    } else if (data.title !== prevName || data.dueDate !== prevDueDate || data.priority !== prevPriority) {
        // change the taskDOM name or dueDate
        projectContent.editTask(task.id, data.title, data.dueDate, data.priority, task.isDone);
        updateProjects();
    }

    // exit form
    taskForm.exitForm();
};

const moveTask = (taskList, taskid) => {
    // save the task and delete it from current project's taskList
    const newTask = taskList.getTask(taskid);
    taskList.removeTask(taskid);
    // get the new project's taskList and insert the new task
    const newProjectID = state.projectList.getProjectID(newTask.projectName);
    const newTaskList = state.projectList.getTaskList(newProjectID);
    // addTask (title, description, dueDate, priority, projectName, notes = '', isDone = false)
    newTaskList.addTask(newTask.title, newTask.description, newTask.dueDate, newTask.priority, newTask.projectName, newTask.notes, newTask.isDone);
    state.projectList.persistData();
};

const controlTaskTrashBtn = (taskList, taskid, projectid) => {
    // remove the task from the project's task list
    taskList.removeTask(taskid);
    state.projectList.persistData();
    // update the content and project list UIs
    projectContent.removeTask(taskid);
    if (taskList.getNumTasks() > 0) {
        updateProjects();
    } else {
        // re-set the project's box UI
        projectListView.updateNumTasks(taskList.tasks, projectid);
        projectListView.hideTasks(projectid);
        const arrow = projectListView.getArrow(projectid);
        projectListView.transformArrow(arrow);
    }
};

const controlCheckBox = (taskList, taskid, isChecked) => {
    // change the task's isDone status
    taskList.changeDoneStatus(taskid, isChecked);
    if (isChecked) {
        // move the task to the bottom of the list / end of the array
        taskList.moveTaskToEnd(taskid);
    } else {
        // move the task to the top
        taskList.restoreTheTask(taskid);
    }
    state.projectList.persistData();
    // render the task arrays in the projectContent and projectList UI
    const title = elements.mainTitle.textContent;
    console.log(title);
    // if (title !== 'Today' || title !== 'Next 7 Days') {
    //     projectContent.renderTasks(taskList.tasks);
    // } else {
    //     let arr;
    //     if (title === 'Today') {
    //         arr = shortcuts.getTodayTasks(state.projectList);
    //         console.log(arr);
    //     } else if (title === 'Next 7 Days') {

    //     }
    //     projectContent.renderTasks(arr, true);
    // }
    if (title === 'Today') {
        const arr = shortcuts.getTodayTasks(state.projectList);
        projectContent.renderTasks(arr, true);
        console.log(arr);
    } else if (title === 'Next 7 Days') {

    } else {
        projectContent.renderTasks(taskList.tasks);
    }
    projectContent.toggleCheck(taskid, isChecked);
    updateProjects();
};

/**
 * Control the sortable JS library
 */
const updateTasks = () => {
    if (elements.mainTitle.textContent !== 'Today' || elements.mainTitle.textContent !== 'Next 7 Days') {
    // get the task index order from the taskList DOM
    const taskids = projectContent.getListOrder();
    // update the task array to match that order
    const projectID = state.projectList.getProjectID(elements.mainTitle.textContent);
    const taskList = state.projectList.getTaskList(projectID);
    taskList.rearrangeTasks(taskids);
    state.projectList.persistData();
    // update the project list UI 
    updateProjects();
    }
};

/**
 * Shortcuts controller
 */
elements.todayShortcut.addEventListener('click', () => {
    // get the tasks for today
    const tasksArr = shortcuts.getTodayTasks(state.projectList);
    // show it in the main content UI
    shortcutsView.renderTitle('today');
    projectContent.renderTasks(tasksArr, true);
});
