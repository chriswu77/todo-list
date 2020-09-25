import uniqid from 'uniqid';
import Task from './Task';

export default class Project {
    constructor () {
        this.projects = [];
    }

    addProject (name) {
        const id = uniqid();
        const taskList = new Task();

        const project = {id, name, taskList};
        this.projects.push(project);

        // Persist data in localStorage
        this.persistData();

        return project;
    }

    removeProject (id) {
        const index = id;
        this.projects.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    }

    renameProject (id, newName) {
        const index = id;
        this.projects[index].name = newName;
    }

    persistData() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('projects'));
        
        // Restoring projects from the localStorage
        if (storage) this.projects = storage;
    }

    getNumProjects () {
        return this.projects.length;
    }

}