import uniqid from 'uniqid';
import isToday from 'date-fns/isToday';
import addDays from 'date-fns/addDays';
import isWithinInterval from 'date-fns/isWithinInterval';
import addMinutes from 'date-fns/addMinutes'

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

    changeDoneStatus (id, status) {
        const task = this.getTask(id);
        task.isDone = status;
    }

    moveTaskToEnd (id) {
        const index = this.tasks.findIndex(task => task.id === id);
        this.tasks.push(this.tasks.splice(index, 1)[0]);
    }

    restoreTheTask (id) {
        const task = this.getTask(id);
        this.removeTask(id);
        this.tasks.unshift(task);
    }

    rearrangeTasks (idArr) {
        // copy the tasks array
        const copy = [...this.tasks];
        // set the tasks to empty
        this.tasks.length = 0;
        //push in the tasks under the new order
        idArr.forEach(id => {
            // get the task from the copy
            const index = copy.findIndex(task => task.id === id);
            const task = copy[index];
            // insert the task into the array
            this.tasks.push(task);
        });
    }

    getTodayTasks () {
        const todayArr = [];
        const offset = new Date().getTimezoneOffset(); 

        this.tasks.forEach(task => {
            let dueDatev2 = new Date(task.dueDate);
            dueDatev2 = addMinutes(dueDatev2, offset);
            if(isToday(dueDatev2)) {
                todayArr.push(task);
            }
        });
        return todayArr;
    }

    getWeekTasks () {
        const today = new Date();
        const offset = today.getTimezoneOffset(); 
        const endOfWeek = addDays(today, 7);
        const ansArr = [];

        this.tasks.forEach(task => {
            let dueDatev2 = new Date(task.dueDate);
            dueDatev2 = addMinutes(dueDatev2, offset);
            // is the dueDate within the next 7 days?
            if (isWithinInterval(dueDatev2, {
                start: today,
                end: endOfWeek
            })) {
                ansArr.push(task);
            }
        });

        return ansArr;
    }
}