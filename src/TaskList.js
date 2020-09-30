import uniqid from 'uniqid';

export default class TaskList {

    constructor() {
        this.tasks = [];
    }

    addTask (title, description, dueDate, priority, projectName, notes = '', isDone = false) {
        const id = uniqid();

        const task = {id, title, description, dueDate, priority, projectName, notes, isDone};

        this.tasks.push(task);
        return task;
    }

    removeTask (id) {
        const index = this.tasks.findIndex(task => task.id === id);
        this.tasks.splice(index, 1);
    }

    getNumTasks () {
        return this.tasks.length;
    }

}