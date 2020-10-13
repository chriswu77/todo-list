
export const getTasks = (projectList, option) => {
    const tasks = [];
    let selectedTasks;

    const projectArray = projectList.projects;
    projectArray.forEach(project => {
        const taskList = projectList.getTaskList(project.id);

        if (option === 'today') {
            selectedTasks = taskList.getTodayTasks();
        } else if (option === 'week') {
            selectedTasks = taskList.getWeekTasks(); 
        }

        if (selectedTasks.length > 0) {
            selectedTasks.forEach(task => tasks.push(task));
        }
    });

    return tasks;
};

export const getTaskCount = (projectList, option) => {
    const arr = getTasks(projectList, option);
    return arr.length;
};