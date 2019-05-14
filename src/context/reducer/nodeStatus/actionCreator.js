import * as actionTypes from './actionTypes';

export const setSelect = (node_id, select_by_click) => ({
    type: actionTypes.SET_SELECT,
    data: {
        cur_select: node_id,
        select_by_click: select_by_click || false,
        cur_edit: '',
        cur_node_info: {}
    }
});

export const setEdit = node_id => ({
    type: actionTypes.SET_EDIT,
    data: {
        cur_select: '',
        cur_edit: node_id,
        cur_node_info: {}
    }
});

export const clearAll = () => ({
    type: actionTypes.CLEAR_ALL,
    data: {
        cur_select: '',
        select_by_click: false,
        cur_edit: '',
        cur_node_info: {}
    }
});

export const getNodeInfo = (node, parent, on_left) => ({
    type: actionTypes.GET_NODE_INFO,
    data: {
        cur_node_info: {
            ...node,
            parent,
            on_left
        }
    }
});
