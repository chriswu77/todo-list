/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
import elements from './base';

export const renderTitle = (option) => {
  elements.titleBtns.innerHTML = '';
  if (option === 'today') {
    elements.mainTitle.textContent = 'Today';
  } else {
    elements.mainTitle.textContent = 'Next 7 Days';
  }
};

export const renderNumTasks = (todayCount, weekCount) => {
  elements.todayCount.textContent = todayCount;
  elements.weekCount.textContent = weekCount;

  if (todayCount > 0) {
    elements.todayCount.style.visibility = 'visible';
  } else {
    elements.todayCount.style.visibility = 'hidden';
  }

  if (weekCount > 0) {
    elements.weekCount.style.visibility = 'visible';
  } else {
    elements.weekCount.style.visibility = 'hidden';
  }
};

export const updateProjectInfo = (taskid, name) => {
  const parentElement = elements.taskList.querySelector(
    `[data-taskid="${taskid}"]`
  );
  parentElement.dataset.projectname = name;

  const projectName = parentElement.querySelector('.task-proj-name');
  projectName.textContent = name;
};

export const hoverShortcuts = (e, option, hover) => {
  let parentEl;
  if (option === 'today') {
    parentEl = e.target.closest('#today-container');
  } else if (option === 'week') {
    parentEl = e.target.closest('#week-container');
  }
  const textEl = parentEl.querySelector('.title-text');
  const numEl = parentEl.querySelector('.task-num-style');

  if (hover) {
    textEl.classList.add('hover');
    numEl.classList.add('hover');
  } else {
    textEl.classList.remove('hover');
    numEl.classList.remove('hover');
  }
};

export const applyActive = (parent) => {
  removeActive();

  const text = parent.querySelector('.title-text');
  const numTask = parent.querySelector('.task-num-style');
  parent.classList.add('highlight');
  text.classList.add('bold');
  numTask.classList.add('bold');
};

export const removeActive = () => {
  const texts = Array.from(document.querySelectorAll('.title-text'));
  texts.forEach((text) => text.classList.remove('bold'));
  elements.todayCount.classList.remove('bold');
  elements.weekCount.classList.remove('bold');
  elements.todayShortcut.classList.remove('highlight');
  elements.weekShortcut.classList.remove('highlight');
};
