import * as actionTypes from './actionTypes';
// import defaultMindmap from '../../../statics/defaultMindmap';
import {deepCopy} from '../../../methods/assistFunctions';

export const defaultValue_editPanel = {
    isShow:false,
    nodeId:''
};

export default (panel, action) => {
    switch (action.type) {        
        case actionTypes.TOGGLE_PANEL_SHOW: 
            const newPanel = deepCopy(panel);
            newPanel.isShow=action.data.isShow
            return newPanel        
        default:
            return panel;
    }
};