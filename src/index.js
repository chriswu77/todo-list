import Project from './projectList';
import * as projectListView from './projectListView';

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

    if (!state.projectList) state.projectList = new Project();

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

    // console.log(state.projectList.projects);
});