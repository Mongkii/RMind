import {useContext} from 'react';
import {context} from '../context';
import {setMindmap} from '../context/reducer/mindmap/actionCreator.js';
import {setSelect} from '../context/reducer/nodeStatus/actionCreator.js';

export default () => {
    const {mindmap: {dispatch: mDispatch}, nodeStatus: {dispatch: nDispatch}, history: {state: history}} = useContext(context);

    const applySnapshot = snapshot => {
        if (snapshot) {
            const {mindmap, cur_node} = snapshot;
            mDispatch(setMindmap(JSON.parse(mindmap)));
            nDispatch(setSelect(cur_node));
        }
    };

    return {
        undoHistory: () => {
            applySnapshot(history.undo[history.undo.length - 1]);
        },
        redoHistory: () => {
            applySnapshot(history.redo[0]);
        }
    }
}

