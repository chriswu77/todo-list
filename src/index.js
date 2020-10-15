import ProjectList from './ProjectList';
import TodayOrder from './todayOrder';
import WeekOrder from './weekOrder';
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
    if (!state.todayOrder) state.todayOrder = new TodayOrder();
    if (!state.weekOrder) state.weekOrder = new WeekOrder();

    if (!state.moveableTaskList) state.moveableTaskList = new Sortable(elements.taskList, {
        animation: 200,
        filter: '.done',
        onUpdate: function (/**Event*/ evt) {
            updateTasks();
          }
    });

    // read in the today and week shortcuts saved task order
    state.todayOrder.readStorage();
    state.weekOrder.readStorage();

    // check if storage has any projects
    state.projectList.readStorage();

    const numProjects = state.projectList.getNumProjects();

    if (numProjects === 0) {
        //if empty, create a default project
        const defaultProject = state.projectList.addProject("Default Project");
        projectListView.renderProject(defaultProject);
        // render the project data in the content UI
        projectContent.renderProjectTitle(defaultProject.name);
        // edit today shortcuts
        shortcutsView.renderNumTasks(0,0);
    } else {
        // render saved projects in project list
        projectListView.renderSavedProjects(state.projectList.projects);
        // render first saved project in content
        const firstProject = state.projectList.projects[0];
        const taskList = state.projectList.getTaskList(firstProject.id);
        projectContent.renderProjectTitle(firstProject.name);
        projectContent.renderTasks(taskList.tasks);
        // render the number of tasks in shortcuts UI
        updateShortcuts();
    }
});

const updateShortcuts = () => {
    const todayCount = shortcuts.getTaskCount(state.projectList, 'today');
    const weekCount = shortcuts.getTaskCount(state.projectList, 'week');
    shortcutsView.renderNumTasks(todayCount, weekCount);
};

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
    const task = taskList.addTask(null, data.title, data.description, data.dueDate, data.priority, data.project, data.notes);
    state.projectList.persistData();

    // add Task to the shortcuts order data if due Today or next 7 days
    addToShortcutsOrder(taskList, task);

    // update and render the task in the project list UI
    updateProjects();

    // add the task in content container if task belongs in the current open one
    updateContent(taskList, task);

    // update shortcuts number of tasks
    updateShortcuts();

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
    const title = elements.mainTitle.textContent;
    if (title === task.projectName) {
        projectContent.renderTasks(taskList.tasks);
    } else if (title === 'Today' && taskList.isDueToday(task.dueDate)) {
        // let tasksArr = shortcuts.getTasks(state.projectList, 'today');
        // tasksArr = state.todayOrder.rearrangeTasks(tasksArr);
        // projectContent.renderTasks(tasksArr, true);
        renderShortcutsContent('today');
    } else if (title === 'Next 7 Days' && taskList.isDueThisWeek(task.dueDate)) {
        // let tasksArr = shortcuts.getTasks(state.projectList, 'week');
        // tasksArr = state.weekOrder.rearrangeTasks(tasksArr);
        // projectContent.renderTasks(tasksArr, true);
        renderShortcutsContent('week');
    }
};

const addToShortcutsOrder = (taskList, task) => {
    if (taskList.isDueToday(task.dueDate)) {
        state.todayOrder.addTask(task.id);
    } else if (taskList.isDueThisWeek(task.dueDate)) {
        state.weekOrder.addTask(task.id);
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

    if (editBtn) {
        const data = clickInfo(e, false);
        controlEditTaskBtn(data.taskList, data.task);
    } else if (deleteBtn) {
        const data = clickInfo(e, false)
        controlTaskTrashBtn(data.taskList, data.taskID, data.projectID);
    } else if (checkBox) {
        const isChecked = e.target.checked;
        const data = clickInfo(e, true);
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
        const title = elements.mainTitle.textContent;
        if (title === 'Today' || title === 'Next 7 Days') {
            // only update the project name description
            shortcutsView.updateProjectInfo(task.id, data.project);
        } else {
            // remove the task from the project view if not shortcuts
            projectContent.removeTask(task.id);
        }
        moveTask(taskList, task.id);
        projectListView.renderSavedProjects(state.projectList.projects);
    } else if (data.title !== prevName || data.dueDate !== prevDueDate || data.priority !== prevPriority) {
        // change the taskDOM name or dueDate
        projectContent.editTask(task.id, data.title, data.dueDate, data.priority, task.isDone);
        updateProjects();
    }

    // update shortcuts
    updateShortcuts();

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
    newTaskList.addTask(newTask.id, newTask.title, newTask.description, newTask.dueDate, newTask.priority, newTask.projectName, newTask.notes, newTask.isDone);
    state.projectList.persistData();
};

const controlTaskTrashBtn = (taskList, taskid, projectid) => {
    // remove from the shortcuts order data
    removeShortcutsOrder(taskList, taskid);

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
    // update shortcuts task num
    updateShortcuts();
};

const removeShortcutsOrder = (taskList, taskid) => {
    const date = taskList.getTask(taskid).dueDate;

    if (taskList.isDueToday(date)) {
        state.todayOrder.removeTask(taskid);
    } else if (taskList.isDueThisWeek(date)) {
        state.weekOrder.removeTask(taskid);
    }
};

const controlCheckBox = (taskList, taskid, isChecked) => {
    const title = elements.mainTitle.textContent;

    // change the task's isDone status
    taskList.changeDoneStatus(taskid, isChecked);
    if (isChecked) {
        // move the task to the bottom of the list / end of the array
        taskList.moveTaskToEnd(taskid);

        if (title === 'Today') {
            state.todayOrder.moveTaskToEnd(taskid);
        } else if (title === 'Next 7 Days') {
            state.weekOrder.moveTaskToEnd(taskid);
        }
    } else {
        // move the task to the top
        taskList.restoreTheTask(taskid);

        if (title === 'Today') {
            state.todayOrder.restoreTask(taskid);
        } else if (title === 'Next 7 Days') {
            state.weekOrder.restoreTask(taskid);
        }
    }

    state.projectList.persistData();

    // render the task arrays in the projectContent and projectList UI
    if (title === 'Today') {
        renderShortcutsContent('today');
    } else if (title === 'Next 7 Days') {
        // let arr = shortcuts.getTasks(state.projectList, 'week');
        // arr = state.weekOrder.rearrangeTasks(arr);
        // projectContent.renderTasks(arr, true);
        renderShortcutsContent('week');
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
    const title = elements.mainTitle.textContent;
    const taskids = projectContent.getListOrder();

    if (title === 'Today') {
        state.todayOrder.updateOrder(taskids);
    } else if (title === 'Next 7 Days') {
        state.weekOrder.updateOrder(taskids);
    } else {
        // update the task array to match the list order
        const projectID = state.projectList.getProjectID(title);
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
    shortcutsView.renderTitle('today');
    projectContent.clearContents();

    const numOfTasks = shortcuts.getTasks(state.projectList, 'today').length;
    if (numOfTasks > 0) {
        renderShortcutsContent('today');
    }
});

elements.weekShortcut.addEventListener('click', () => {
    shortcutsView.renderTitle('week');
    projectContent.clearContents();

    const numOfTasks = shortcuts.getTasks(state.projectList, 'week').length;
    if (numOfTasks > 0) {
        renderShortcutsContent('week');
    }
});

const renderShortcutsContent = option => {
    let tasksArr;
    if (option === 'today') {
        tasksArr = shortcuts.getTasks(state.projectList, 'today');
        tasksArr = state.todayOrder.rearrangeTasks(tasksArr);
    } else {
        tasksArr = shortcuts.getTasks(state.projectList, 'week');
        tasksArr = state.weekOrder.rearrangeTasks(tasksArr);
    }
    projectContent.renderTasks(tasksArr, true);
}

// work on checkbox -- set it to update the today and week order regardless of current page