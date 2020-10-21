import {elements} from './base';

export const renderForm = (btn, projectName) => {
    elements.modal.style.visibility = 'visible';
    elements.modalContent.innerHTML = `
    <form id="add-proj-form">
        ${getInputHTML(btn, projectName)}
        <div class="btn-container">
            <input type="button" class="cancel-btn" value="Cancel">
            <input type="submit" class="submit-btn" value="Submit">
        </div>
    </form>
    `;

    // set up exit form event listeners
    document.querySelector('.cancel-btn').addEventListener('click', exitForm);
    window.addEventListener('click', e => {
        if (e.target.matches('.modal')) {
            exitForm();
        }
    });
};

export const exitForm = () => {
    elements.modal.style.visibility = 'hidden';
};

export const getInput = () => document.querySelector('.proj-name-input').value;

const getInputHTML = (btn, projectName) => {
    let markup;
    if (btn === 'add') {
        markup = `<input type="text" class="proj-name-input" placeholder="Project Name"></input>`;
    } else {
        markup = `<input type="text" class="proj-name-input" placeholder="Project Name" value="${projectName}"></input>`;
    }
    return markup;
};

export const validateForm = () => {
    const submitBtn = document.querySelector('.submit-btn');
    let input = document.querySelector('.proj-name-input').value;

    if (input !== '') {
        //apply active state css
        submitBtn.setAttribute('style', 'opacity: 1; border: 1.75px solid #5898DD;');
    } else {
        // grey it out
        submitBtn.setAttribute('style', 'opacity: 0.25');
    }
};