import * as actionTypes from './actionTypes';
import {NEW_NODE_TEXT} from '../../../statics/refer';

export const toggleChildren = (node_id, bool) => ({
    type: actionTypes.TOGGLE_CHILDREN,
    data: {
        node_id,
        node: {
            showChildren: bool
        }
    }
});

export const addChild = (node_id, new_node_id) => ({
    type: actionTypes.ADD_CHILD,
    data: {
        node_id,
        node: {
            id: new_node_id,
            text: NEW_NODE_TEXT,
            showChildren: true,
            children: []
        }
    }
});

export const addSibling = (node_id, parent_id, new_node_id) => ({
    type: actionTypes.ADD_SIBLING,
    data: {
        node_id,
        parent_id,
        node: {
            id: new_node_id,
            text: NEW_NODE_TEXT,
            showChildren: true,
            children: []
        }
    }
});

export const moveNode = (node_id, target_id, parent_id, is_sibling) => ({
    type: actionTypes.MOVE_NODE,
    data: {
        node_id,
        target_id,
        parent_id,
        is_sibling
    }
});

export const changeText = (node_id, text) => ({
    type: actionTypes.CHANGE_TEXT,
    data: {
        node_id,
        node: {
            text
        }
    }
});

export const changeInfo = (node_id, info) => ({
    type: actionTypes.CHANGE_TEXT,
    data: {
        node_id,
        node: {
            info
        }
    }
});

export const deleteNode = (node_id, parent_id) => ({
    type: actionTypes.DELETE_NODE,
    data: {
        node_id,
        parent_id
    }
});

export const expandAll = node_id => ({
    type: actionTypes.EXPAND_ALL,
    data: {
        node_id
    }
});

export const setMindmap = mindmap => ({
    type: actionTypes.SET_MINDMAP,
    data: {
        mindmap
    }
});
