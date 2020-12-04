/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
import elements from './base';

export const renderProject = (project) => {
  const markup = `
    <div class="project-item-container" data-projectid="${project.id}">
        <div class="view-1">
            <i class="fas fa-chevron-right"></i>
            <div class="click-proj">
                <div class="shortcut-text proj-name">${project.name}</div>
                ${renderNumTasks(project.taskList.tasks, project.id)}
            </div>
        </div>

        <div class="view-2" data-viewid="${project.id}"></div>
    </div>
    `;

  elements.projectList.insertAdjacentHTML('beforeend', markup);
};

const renderNumTasks = (taskArray, id) => {
  const numTasks = taskArray.length;
  let markup = '';
  if (numTasks > 0) {
    markup = `
            <div class="task-num-style proj-task-num" data-countid="${id}">${numTasks}</div>
        `;
  } else {
    markup = `
        <div class="task-num-style proj-task-num" data-countid="${id}" style="visibility: hidden;">${numTasks}</div>
    `;
  }
  return markup;
};

export const updateNumTasks = (taskArray, id) => {
  const numTaskDOM = document.querySelector(`[data-countid="${id}"]`);
  const numTasks = taskArray.length;

  numTaskDOM.textContent = numTasks;
  if (numTasks > 0) {
    numTaskDOM.style.visibility = 'visible';
  } else {
    numTaskDOM.style.visibility = 'hidden';
  }
};

export const renderProjectTasks = (taskArray, projectID) => {
  const dropdownView = document.querySelector(`[data-viewid="${projectID}"]`);

  dropdownView.innerHTML = '';

  taskArray.forEach((task) => {
    const markup = `
        <div class="proj-items shortcut-text ${setTextStyle(
          task.priority,
          task.isDone
        )}" data-taskid="${task.id}">${task.title}</div>
        `;
    dropdownView.insertAdjacentHTML('beforeend', markup);
  });
};

const setTextStyle = (priority, isDone) => {
  let markup = '';
  if (isDone) {
    markup += 'finished ';
  }

  if (priority === 'high') {
    markup += 'danger';
  } else if (priority === 'medium') {
    markup += 'primary';
  }

  return markup;
};

export const isExpanded = (projectID) => {
  const dropdownView = document.querySelector(`[data-viewid="${projectID}"]`);
  if (dropdownView.innerHTML !== '') {
    return true;
  }
  return false;
};

export const hideTasks = (projectID) => {
  const dropdownView = document.querySelector(`[data-viewid="${projectID}"]`);
  dropdownView.innerHTML = '';
};

export const renderSavedProjects = (projArray) => {
  elements.projectList.innerHTML = '';
  projArray.forEach((proj) => renderProject(proj));
};

export const transformArrow = (arrow) => {
  arrow.classList.toggle('rotate');
};

export const deleteProject = (id) => {
  const el = document.querySelector(`[data-projectid="${id}"]`);
  el.parentElement.removeChild(el);
};

export const renameProject = (id, newName) => {
  const parent = document.querySelector(`[data-projectid="${id}"]`);
  const projectNameDOM = parent.querySelector('.proj-name');

  projectNameDOM.textContent = newName;
};

export const getArrow = (projectid) => {
  const parent = document.querySelector(`[data-projectid="${projectid}"]`);
  const arrow = parent.querySelector('.fa-chevron-right');
  return arrow;
};

export const applyActive = (parent) => {
  removeActive();

  const text = parent.querySelector('.proj-name');
  const taskNum = parent.querySelector('.proj-task-num');

  parent.classList.add('highlight');
  text.classList.add('bold');
  taskNum.classList.add('bold');
};

export const removeActive = () => {
  const allProjs = Array.from(document.querySelectorAll('.click-proj'));
  const allTitles = Array.from(document.querySelectorAll('.proj-name'));
  const allTaskNums = Array.from(document.querySelectorAll('.proj-task-num'));

  allProjs.forEach((box) => box.classList.remove('highlight'));
  allTitles.forEach((title) => title.classList.remove('bold'));
  allTaskNums.forEach((num) => num.classList.remove('bold'));
};

export const applyTaskActive = (taskid) => {
  removeTaskActive();

  const taskDOM = elements.projectList.querySelector(
    `[data-taskid="${taskid}"]`
  );
  taskDOM.classList.add('bold');
  taskDOM.classList.add('highlight');
};

export const removeTaskActive = () => {
  const allTasks = Array.from(
    elements.projectList.querySelectorAll('.proj-items')
  );
  allTasks.forEach((task) => task.classList.remove('bold'));
  allTasks.forEach((task) => task.classList.remove('highlight'));
};
