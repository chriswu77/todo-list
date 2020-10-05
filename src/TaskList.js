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

    getTask (id) {
        const index = this.tasks.findIndex(task => task.id === id);
        return this.tasks[index];
    }

    editTask (id, title, description, dueDate, priority, projectName, notes) {
        const task = this.getTask(id);
        task.title = title;
        task.description = description;
        task.dueDate = dueDate;
        task.priority = priority;
        task.projectName = projectName;
        task.notes = notes;
    }
}