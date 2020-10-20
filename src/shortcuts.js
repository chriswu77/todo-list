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

export const refreshTodayOrder = (todayOrder, projectList) => {
    if (todayOrder.order.length === 0) return;

    const newTasks = getTasks(projectList, 'today');
    const newTaskIDs = newTasks.map(task => task.id);

    const newOrder = [];
    todayOrder.order.forEach(taskid => {
        if (newTaskIDs.includes(taskid)) {
            newOrder.push(taskid);
        }
    });

    // update if a task dueDate is editted to today
    newTaskIDs.forEach(taskid => {
        if (!newOrder.includes(taskid)) {
            newOrder.push(taskid);
        }
    });

    todayOrder.updateOrder(newOrder);
};

export const refreshWeekOrder = (weekOrder, projectList) => {
    if (weekOrder.order.length === 0) return;

    const newTasks = getTasks(projectList, 'week');
    const newTaskIDs = newTasks.map(task => task.id);

    const newOrder = [];
    weekOrder.order.forEach(taskid => {
        if (newTaskIDs.includes(taskid)) {
            newOrder.push(taskid);
        }
    });

    // push in any missing future tasks that are newly due this week or if task dueDate is editted to this week
    newTaskIDs.forEach(taskid => {
        if (!newOrder.includes(taskid)) {
            newOrder.push(taskid);
        }
    });

    weekOrder.updateOrder(newOrder);
};