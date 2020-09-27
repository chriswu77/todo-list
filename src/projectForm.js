import {elements} from './base';

export const renderForm = () => {
    elements.modal.style.visibility = 'visible';
    elements.modalContent.innerHTML = `
    <form id="add-proj-form">
        <input type="text" class="proj-name-input" placeholder="Project Name">
        <div class="btn-container">
            <input type="button" class="cancel-btn" value="Cancel">
            <input type="submit" class="submit-btn" vale="Submit">
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

export const clearInput = () => {
    document.querySelector('.proj-name-input').value = '';
};