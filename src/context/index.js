import React, {useReducer} from 'react';
import mindmapReducer, {defaultValue_mindmap} from './reducer/mindmap/';
import nodeStatusReducer, {defaultValue_nodeStatus} from './reducer/nodeStatus';
import historyReducer, {defaultValue_history} from './reducer/history';
import globalReducer, {defaultValue_global} from './reducer/global';

const context = React.createContext({});

const WrappedProvider = props => {
    const [mState, mDispatch] = useReducer(mindmapReducer, defaultValue_mindmap);
    const [nState, nDispatch] = useReducer(nodeStatusReducer, defaultValue_nodeStatus);
    const [hState, hDispatch] = useReducer(historyReducer, defaultValue_history);
    const [gState, gDispatch] = useReducer(globalReducer, defaultValue_global);
    const combined = {
        mindmap: {
            state: mState,
            dispatch: mDispatch
        },
        nodeStatus: {
            state: nState,
            dispatch: nDispatch
        },
        history: {
            state: hState,
            dispatch: hDispatch
        },
        global: {
            state: gState,
            dispatch: gDispatch
        }
    };

    return (<context.Provider value={combined}>
        {props.children}
    </context.Provider>)
};

export {context};
export default WrappedProvider;