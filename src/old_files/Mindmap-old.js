import React, {useState, useEffect, useContext, useRef} from 'react';
import {css} from 'emotion';
import {context} from '../context';
import LineCanvas from '../components/LineCanvas';
import DragCanvas from '../components/DragCanvas';
import RootNode from '../components/RootNode';
import {findNode, saveMindmap} from '../methods/assistFunctions';
import useMindmap from '../customHooks/useMindmap';
import * as refer from '../statics/refer';
import {drawDragCanvas} from '../methods/drawCanvas';
import getDragEvents from '../methods/getDragEvents';

const node_refs = new Set();

const Graph = () => {
    const self = useRef();
    const drag = useRef();
    const {mindmap: {state: root_node, dispatch: m_dispatch}, nodeStatus: {state: nodeStatus}} = useContext(context);

    const {addChild, addSibling, deleteNode, editNode, toggleChildren, clearNodeStatus, selectNode, moveNode} = useMindmap();

    //const [, ] = useState();

    /*
    /// 缩放功能。Chrome + Mac，第一次缩放没有滚动条，必须打开一次 console 才会出现。由于该 bug，以后再考虑实现缩放
    const handleScale = event => {
        if (event.altKey) {
            let scale_value = (Number(self.current.style.transform.slice(6, -1)) || 1) + 0.01 * event.deltaY;
            // 为 100% 设置卡位
            if (scale_value >= 0.95 && scale_value < 1.05) {
                scale_value = 1;
            }
            // 设定缩放的最小值
            if (scale_value < 0.5) {
                scale_value = 0.5;
            }
            self.current.style.transform = `scale(${scale_value}`;
        }
    };
     */

    let node_id = '', parent_id = '', target_id = '', is_sibling, siblings = [], siblings_left_bound = [],
        in_drop_area = false,
        siblings_right_bound = [],
        siblings_vertical_step = [], parent_pos, parent_is_root = false, drag_canvas;

    const dragEvents = [
        {
            type: 'dragstart',
            listener: event => {
                in_drop_area = false;
                parent_is_root = false;
                if (event.target && (event.target.dataset.tag === refer.LEFT_NODE || event.target.dataset.tag === refer.RIGHT_NODE)) {
                    console.log(event.target.id);
                    node_id = event.target.id;
                    parent_id = event.target.dataset.parent;
                    const node_found = findNode(root_node, parent_id);
                    siblings[0] = node_found.children.map(child => child.id);
                    parent_pos = document.getElementById(parent_id).getBoundingClientRect();
                    let bounding = [];
                    bounding[0] = siblings[0].map(node_id => document.getElementById(node_id).getBoundingClientRect());
                    console.log(siblings);
                    console.log(bounding);
                    if (node_found === root_node && root_node.children.length > 3) {
                        const l = root_node.children.length,
                            half = Math.trunc(l / 2);
                        siblings = [siblings[0].slice(0, half), siblings[0].slice(half)];
                        bounding = [bounding[0].slice(0, half), bounding[0].slice(half)];
                        parent_is_root = true;
                    }
                    console.log(siblings);
                    console.log(bounding);
                    // const map = new Map(Array.from(node_refs).map(ref => [ref.current.id, ref.current.getBoundingClientRect()]));
                    /// 优化
                    siblings_left_bound = bounding.map(part => Math.min(...part.map(rect => rect.left)));
                    siblings_right_bound = bounding.map(part => Math.max(...part.map(rect => rect.right)));
                    siblings_vertical_step = bounding.map(part => part.map(rect => [rect.top, rect.bottom]).reduce((sum, cur) => sum.concat(cur), []));
                    // console.log(siblings_left_bound, siblings_right_bound, siblings_vertical_step);
                    drag_canvas = drag;
                }
            }
        },
        {
            type: 'drag',
            listener: event => {
                const ctx = drag_canvas.current.getContext('2d');
                ctx.clearRect(0, 0, drag_canvas.current.width, drag_canvas.current.height);
                if (!in_drop_area && event.x > siblings_left_bound[0] && event.x < siblings_right_bound[0]) {
                    ctx.beginPath();
                    if (event.y > siblings_vertical_step[0][0] - 100 && event.y < siblings_vertical_step[0][0]) { // 优化体验，实际是显示的 2 倍
                        drawDragCanvas(ctx, node_id, parent_pos, siblings_left_bound[0], siblings_right_bound[0], siblings_vertical_step[0][0] - 50, siblings_vertical_step[0][0], (document.getElementById(node_id).dataset.tag === refer.LEFT_NODE) && !parent_is_root);
                        target_id = siblings[0][0];
                        is_sibling = true;
                        return;
                    }
                    for (let i = 2; i < siblings_vertical_step[0].length; i += 2) {
                        if (event.y > siblings_vertical_step[0][i - 1] && event.y < siblings_vertical_step[0][i]) {
                            drawDragCanvas(ctx, node_id, parent_pos, siblings_left_bound[0], siblings_right_bound[0], siblings_vertical_step[0][i - 1], siblings_vertical_step[0][i], (document.getElementById(node_id).dataset.tag === refer.LEFT_NODE) && !parent_is_root);
                            target_id = siblings[0][i / 2];
                            is_sibling = true;
                        }
                    }
                    if (event.y > siblings_vertical_step[0][siblings_vertical_step[0].length - 1] && event.y < siblings_vertical_step[0][siblings_vertical_step[0].length - 1] + 100) {
                        drawDragCanvas(ctx, node_id, parent_pos, siblings_left_bound[0], siblings_right_bound[0], siblings_vertical_step[0][siblings_vertical_step[0].length - 1], siblings_vertical_step[0][siblings_vertical_step[0].length - 1] + 50, (document.getElementById(node_id).dataset.tag === refer.LEFT_NODE) && !parent_is_root);
                        target_id = siblings[1] && siblings[1][0];
                        is_sibling = true;
                    }
                    ctx.closePath();
                } else if (!in_drop_area && siblings[1] && event.x > siblings_left_bound[1] && event.x < siblings_right_bound[1]) {
                    console.log('LEFT TRIGGERED');
                    ctx.beginPath();
                    if (event.y < siblings_vertical_step[1][0]) { /// 这一步搞清楚->in dropArea flag
                        target_id = siblings[1][0];
                        is_sibling = true;
                        return;
                    }
                    for (let i = 2; i < siblings_vertical_step[1].length; i += 2) {
                        if (event.y > siblings_vertical_step[1][i - 1] && event.y < siblings_vertical_step[1][i]) {
                            drawDragCanvas(ctx, node_id, parent_pos, siblings_left_bound[1], siblings_right_bound[1], siblings_vertical_step[1][i - 1], siblings_vertical_step[1][i], true);
                            target_id = siblings[1][i / 2];
                            is_sibling = true;
                        }
                    }
                    if (event.y > siblings_vertical_step[1][siblings_vertical_step[1].length - 1]) {
                        target_id = undefined;
                        is_sibling = true;
                    }
                    ctx.closePath();
                }
            }
        },
        {
            type: 'dragover',
            listener: event => {
                event.preventDefault();
            }
        },
        {
            type: 'dragenter',
            listener: event => {
                if (event.target && event.target.dataset.tag === refer.DROP_AREA) {
                    event.target.parentNode.classList.add('ondrag');
                    in_drop_area = true;
                    target_id = event.target.parentNode.id;
                    console.log(`drag enter: ${target_id}`);
                    is_sibling = false;
                }
            }
        },
        {
            type: 'dragleave',
            listener: event => {
                if (event.target && event.target.dataset.tag === refer.DROP_AREA) {
                    event.target.parentNode.classList.remove('ondrag');
                    in_drop_area = false;
                    target_id = '';
                    is_sibling = undefined;
                }
            }
        },
        {
            type: 'drop',
            listener: event => {
                const ctx = drag_canvas.current.getContext('2d');
                ctx.clearRect(0, 0, drag_canvas.current.width, drag_canvas.current.height);
                console.log(event.target);
                console.log(`mouse:x,y: ${event.x}, ${event.y} --- offsetX,Y ${event.offsetX}, ${event.offsetY}`);
                event.target.parentNode.classList.remove('ondrag');
                console.log(node_id, target_id, parent_id);
                if (target_id !== '' && target_id !== node_id && target_id !== parent_id) {
                    m_dispatch({
                        type: 'mindmap/moveNode',
                        data: {node_id: node_id, target_id: target_id, parent_id: parent_id, is_sibling: is_sibling}
                    });
                    selectNode(node_id);
                }
            }
        }/*,
        {
            type: 'dragend',
            listener: () => {
                const ctx = drag_canvas.current.getContext('2d');
                ctx.clearRect(0, 0, drag_canvas.current.width, drag_canvas.current.height);
            }
        }
*/
    ];


    const handleShortKey = event => {
        if (nodeStatus.cur_select !== '') {
            switch (event.key.toUpperCase()) {
                case 'TAB':
                    addChild(nodeStatus.cur_select);
                    break;
                case 'ENTER':
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
                    return;
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleShortKey);
        return () => {
            window.removeEventListener('keydown', handleShortKey);
        }
    }, [nodeStatus.cur_node_info]);

    useEffect(() => {
        dragEvents.forEach(event => window.addEventListener(event.type, event.listener));
        /// 缩放功能
        // window.addEventListener('wheel', handleScale);
        return () => {
            dragEvents.forEach(event => window.removeEventListener(event.type, event.listener));
        }
    }, [root_node]);

    useEffect(() => {
        saveMindmap(root_node);
    }, [root_node]);

    useEffect(() => {
        window.addEventListener('click', clearNodeStatus);
        return () => {
            window.removeEventListener('click', clearNodeStatus);
        }
    }, []);
    /* 不能靠写成以下形式防止其他点击的冒泡，因为思维导图某些空白部分属于 Node，而非 Mindmap，这会导致点击空白却无法隐藏工具栏的「诡异」现象。
    要防止冒泡还是得老实写 stopPropagation
    const handleHideToolbar = event=>{
        if (event.target === self.current) {
            clearNodeStatus();
        }
    };
    */

    return (
        <div className={wrapper} ref={self}>
            <RootNode key={root_node.id} layer={0} node={root_node} node_refs={node_refs} />
            <DragCanvas parent_ref={self} ref={drag} />
            <LineCanvas node_refs={node_refs} node_relation={root_node} parent_ref={self} />
        </div>
    );
};

export default Graph;

// CSS
const wrapper = css`
position: relative;
padding: 30vh 30vw;
width: fit-content;
/*
transform-origin: 0 0;
*/
`;