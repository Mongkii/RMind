import * as actionTypes from './actionTypes';

export const defaultValue_nodeStatus = {
    cur_select: '',
    select_by_click: false,
    cur_edit: '',
    cur_node_info: {}
};

export default (nodeStatus, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECT:
            if (nodeStatus.cur_select === action.data.cur_select) { // 避免 cur_select 未变更时 info 被清空
                delete action.data.cur_node_info;
            }
            return {...nodeStatus, ...action.data};
        case actionTypes.SET_EDIT:
        case actionTypes.CLEAR_ALL:
        case actionTypes.GET_NODE_INFO:
            return {...nodeStatus, ...action.data};
        default:
            return nodeStatus;
    }
};