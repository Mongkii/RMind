import * as actionTypes from './actionTypes';
import defaultMindmap from '../../../statics/defaultMindmap';
import {findNode, deepCopy, setShowChildrenTrue} from '../../../methods/assistFunctions';

export const defaultValue_mindmap = JSON.parse(localStorage.getItem('mindmap')) || defaultMindmap;

export default (mindmap, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_CHILDREN: {
            const new_mindmap = deepCopy(mindmap),
                node_found = findNode(new_mindmap, action.data.node_id);
            if (node_found.children.length > 0 && node_found !== new_mindmap) {
                Object.assign(node_found, action.data.node);
            }
            return new_mindmap;
        }
        case actionTypes.ADD_CHILD: {
            const new_mindmap = deepCopy(mindmap),
                node_found = findNode(new_mindmap, action.data.node_id);
            node_found.children.push(action.data.node);
            return new_mindmap;
        }
        case actionTypes.ADD_SIBLING: {
            const new_mindmap = deepCopy(mindmap);
            if (action.data.parent_id) {
                const node_found = findNode(new_mindmap, action.data.parent_id);
                const insert_index = node_found.children.findIndex(node => node.id === action.data.node_id) + 1;
                node_found.children.splice(insert_index, 0, action.data.node);
            }
            return new_mindmap;
        }
        case actionTypes.MOVE_NODE: {
            const new_mindmap = deepCopy(mindmap),
                parent = findNode(new_mindmap, action.data.parent_id),
                node_index = parent.children.findIndex(node => node.id === action.data.node_id),
                node_copy = parent.children[node_index];
            parent.children.splice(node_index, 1);
            if (action.data.is_sibling) {
                const target_index = parent.children.findIndex(node => node.id === action.data.target_id) + 1 || parent.children.length + 1;
                parent.children.splice(target_index - 1, 0, node_copy);
            } else {
                const target_node = findNode(new_mindmap, action.data.target_id);
                target_node.children.push(node_copy);
            }
            return new_mindmap;
        }
        case actionTypes.CHANGE_TEXT: {
            const new_mindmap = deepCopy(mindmap),
                node_found = findNode(new_mindmap, action.data.node_id);
            Object.assign(node_found, action.data.node);
            return new_mindmap;
        }
        case actionTypes.DELETE_NODE: {
            const new_mindmap = deepCopy(mindmap);
            if (action.data.parent_id) {
                const node_found = findNode(new_mindmap, action.data.parent_id);
                const delete_index = node_found.children.findIndex(node => node.id === action.data.node_id);
                node_found.children.splice(delete_index, 1);
            }
            return new_mindmap;
        }
        case actionTypes.EXPAND_ALL: {
            const new_mindmap = deepCopy(mindmap);
            const node_found = findNode(new_mindmap, action.data.node_id);
            setShowChildrenTrue(node_found);
            return new_mindmap;
        }
        case actionTypes.SET_MINDMAP: {
            return action.data.mindmap;
        }
        default:
            return mindmap;
    }
};