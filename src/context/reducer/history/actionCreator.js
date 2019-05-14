import * as actionTypes from './actionTypes';

export const setHistory = (mindmap, cur_node) => ({
    type: actionTypes.SET_HISTORY,
    data: mindmap ? ({mindmap, cur_node}) : null
});

export const clearHistory = () => ({type: actionTypes.CLEAR_HISTORY});