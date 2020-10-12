import {elements} from './base';

export const renderTitle = option => {
    elements.titleBtns.innerHTML = '';
    if (option === 'today') {
        elements.mainTitle.textContent = 'Today';
    } else {
        elements.mainTitle.textContent = 'Next 7 Days';
    }
};