import {useContext} from 'react';
import {context} from '../context';
import * as mindmapAction from '../context/reducer/mindmap/actionCreator';
import * as nodeStatusAction from '../context/reducer/nodeStatus/actionCreator.js';
import {clearHistory} from '../context/reducer/history/actionCreator';
import md5 from 'md5';

const useMindmap = () => {
    const {mindmap: {dispatch: mDispatch}, nodeStatus: {dispatch: nDispatch}, history: {dispatch: hDispatch}} = useContext(context);
    return {
        toggleChildren: (node_id, bool) => {
            mDispatch(mindmapAction.toggleChildren(node_id, bool));
        },
        addChild: node_id => {
            const new_node_id = md5('' + Date.now() + Math.random());
            mDispatch(mindmapAction.toggleChildren(node_id, true));
            mDispatch(mindmapAction.addChild(node_id, new_node_id));
            nDispatch(nodeStatusAction.setEdit(new_node_id));
        },
        addSibling: (node_id, parent_id) => {
            const new_node_id = md5('' + Date.now() + Math.random());
            mDispatch(mindmapAction.addSibling(node_id, parent_id, new_node_id));
            nDispatch(nodeStatusAction.setEdit(new_node_id));
        },
        moveNode: (node_id, target_id, parent_id, is_sibling) => {
            mDispatch(mindmapAction.moveNode(node_id, target_id, parent_id, is_sibling));
            nDispatch(nodeStatusAction.setSelect(node_id));
        },
        editNode: node_id => {
            nDispatch(nodeStatusAction.setEdit(node_id));
        },
        changeText: (node_id, text) => {
            mDispatch(mindmapAction.changeText(node_id, text));
        },
        editNodeInfo:(node_id,info)=>{
            mDispatch(mindmapAction.changeInfo(node_id, info));                      
          },
        selectNode: (node_id, select_by_click) => {
            nDispatch(nodeStatusAction.setSelect(node_id, select_by_click));
        },
        deleteNode: (node_id, parent_id) => {
            mDispatch(mindmapAction.deleteNode(node_id, parent_id));
            nDispatch(nodeStatusAction.setSelect(parent_id));
        },
        clearNodeStatus: () => {
            nDispatch(nodeStatusAction.clearAll());
        },
        setMindmap: (mindmap, is_new_map) => {
            if (is_new_map) {
                hDispatch(clearHistory());
                nDispatch(nodeStatusAction.setSelect(mindmap.id));
            }
            mDispatch(mindmapAction.setMindmap(mindmap));
        },
        expandAll: node_id => {
            mDispatch(mindmapAction.expandAll(node_id));
            nDispatch(nodeStatusAction.setSelect(node_id));
        }
    }
};

export default useMindmap;