import ProjectList from './ProjectList';
import * as projectListView from './projectListView';
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

    // console.log(state.projectList);
});

/**
 * Project List Controller 
 **/

//  expand project to show tasks
elements.projectList.addEventListener('click', e => {
    const arrow = e.target.closest('.fa-chevron-right');
    if (arrow) {
        // get the project id
        const projectID = arrow.parentElement.parentElement.dataset.projectid;
        // const projectObj = state.projectList.getProject(projectID);
        // console.log(projectObj);
        // console.log(projectID);

        // check if there are any tasks in the project
        const numTasks = state.projectList.getNumTasks(projectID);
        console.log(numTasks);
    }
});