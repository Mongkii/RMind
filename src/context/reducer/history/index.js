import * as actionTypes from './actionTypes';
import {deepCopy} from '../../../methods/assistFunctions';

export const defaultValue_history = {
    undo: [],
    redo: [],
    last_snapshot: null
};

export default (history, action) => {
    switch (action.type) {
        case actionTypes.SET_HISTORY: {
            const new_history = deepCopy(history);
            if (new_history.last_snapshot) {
                if (new_history.undo.length > 0 && new_history.undo[new_history.undo.length - 1].mindmap === action.data.mindmap) {
                    new_history.redo.unshift(new_history.last_snapshot);
                    new_history.undo.pop();
                } else if (new_history.redo.length > 0 && new_history.redo[0].mindmap === action.data.mindmap) {
                    new_history.undo.push(new_history.last_snapshot);
                    new_history.redo.shift();
                } else {
                    new_history.undo.push(new_history.last_snapshot);
                    new_history.redo = [];
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