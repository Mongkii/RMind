import * as refer from '../statics/refer';

export default (nodeStatus, mindmapHook, historyHook) => {
    const {addChild, addSibling, editNode, deleteNode, toggleChildren, selectNode} = mindmapHook;

    const handleKeyEventWithNode = event => {
        switch (event.key.toUpperCase()) {
            case 'TAB':
                addChild(nodeStatus.cur_select);
                break;
            case 'ENTER':
                event.preventDefault(); // 防止 enter 的点击行为
                addSibling(nodeStatus.cur_select, nodeStatus.cur_node_info.parent.id);
                break;
            case 'F2':
                editNode(nodeStatus.cur_select);
                break;
            case 'BACKSPACE':
            case 'DELETE':
                deleteNode(nodeStatus.cur_select, nodeStatus.cur_node_info.parent.id);
                break;
            case ' ':
                event.preventDefault(); // 默认行为会导致画面移动，因此 prevent，下同
                toggleChildren(nodeStatus.cur_select, !nodeStatus.cur_node_info.showChildren); // Boolean('false') === true
                break;
            case 'ARROWLEFT':
                event.preventDefault();
                if (nodeStatus.cur_node_info.parent === refer.ROOT_PARENT) {
                    if (nodeStatus.cur_node_info.children.length > 3) {
                        selectNode(nodeStatus.cur_node_info.children[Math.trunc(nodeStatus.cur_node_info.children.length / 2)].id);
                    }
                } else {
                    if (!nodeStatus.cur_node_info.on_left) {
                        selectNode(nodeStatus.cur_node_info.parent.id);
                    } else if (nodeStatus.cur_node_info.children.length > 0) {
                        selectNode(nodeStatus.cur_node_info.children[0].id);
                    }
                }
                break;
            case 'ARROWRIGHT':
                event.preventDefault();
                if (nodeStatus.cur_node_info.on_left) {
                    selectNode(nodeStatus.cur_node_info.parent.id);
                } else if (nodeStatus.cur_node_info.children.length > 0) {
                    selectNode(nodeStatus.cur_node_info.children[0].id);
                }
                break;
            case 'ARROWUP': {
                event.preventDefault();
                const cur_index = nodeStatus.cur_node_info.parent.children.findIndex(child => child.id === nodeStatus.cur_node_info.id);
                if (cur_index > 0) {
                    selectNode(nodeStatus.cur_node_info.parent.children[cur_index - 1].id);
                }
                break;
            }
            case 'ARROWDOWN': {
                event.preventDefault();
                const cur_index = nodeStatus.cur_node_info.parent.children.findIndex(child => child.id === nodeStatus.cur_node_info.id),
                    last_index = nodeStatus.cur_node_info.parent.children.length - 1;
                if (cur_index < last_index) {
                    selectNode(nodeStatus.cur_node_info.parent.children[cur_index + 1].id);
                }
                break;
            }
            default:
                break;
        }
    };

    return event => {
        if (nodeStatus.cur_edit === '') {
            const is_on_mac = navigator.platform.toUpperCase().startsWith('MAC');
            const combine_key_pressed = is_on_mac ? event.metaKey : event.ctrlKey;
            if (combine_key_pressed && event.key.toUpperCase() === 'Z') {
                if (event.shiftKey) {
                    historyHook.redoHistory();
                } else {
                    historyHook.undoHistory();
                }
            }
        }
        if (nodeStatus.cur_select !== '') {
            try {
                handleKeyEventWithNode(event); // 据说在 try 代码块中写大量语句会影响性能，因此包装为函数
            } catch (e) {
                alert('当前的节点信息存在问题，请重新选择节点');
            }
        }
    };
};