import {elements} from './base';
import isToday from 'date-fns/isToday';
import isThisWeek from 'date-fns/isThisWeek';

export const getTodayTasks = (projectList) => {
    const todayTasks = [];
    // loop through every project's tasks and put them into a new array
    const projectArray = projectList.projects;
    projectArray.forEach(project => {
        // get the tasklist and insert the tasks into the array
        const taskList = projectList.getTaskList(project.id);
        const selectedArr = taskList.getTodayTasks();
        if (selectedArr.length > 0) {
            selectedArr.forEach(task => todayTasks.push(task));
        }
    });
    return todayTasks;
};