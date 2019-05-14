import * as actionTypes from '../context/reducer/history/actionTypes';

const duplicateHistory = (history) => { // 比用 JSON 深拷贝效率要高一些
    let new_history = {};
    new_history.undo = history.undo.map(snapshot => ({...snapshot}));
    new_history.redo = history.redo.map(snapshot => ({...snapshot}));
    new_history.last_snapshot = history.last_snapshot ? {...history.last_snapshot} : null;
    return new_history;
};

export const defaultValue_history = {
    undo: [],
    redo: [],
    last_snapshot: null
};

export default (history, action) => {
    switch (action.type) {
        case actionTypes.SET_HISTORY: {
            const new_history = duplicateHistory(history);
            if (new_history.last_snapshot) {
                const {last_snapshot} = new_history;
                if (new_history.undo.length > 0 && new_history.undo[new_history.undo.length - 1].mindmap === action.data.mindmap) {
                    new_history.redo.unshift(last_snapshot);
                    new_history.undo.pop();
                } else {
                    if (new_history.undo.length === 20) { // 限制历史记录为 20 次
                        new_history.undo.shift();
                    }
                    new_history.undo.push(last_snapshot);
                    if (new_history.redo.length > 0 && new_history.redo[0].mindmap === action.data.mindmap) {
                        new_history.redo.shift();
                    } else {
                        new_history.redo = [];
                    }
                }
            }
            new_history.last_snapshot = action.data;
            return new_history;
        }
        case actionTypes.CLEAR_HISTORY: {
            return defaultValue_history;
        }
        default:
            return history;
    }
};