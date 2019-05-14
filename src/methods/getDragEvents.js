import * as refer from '../statics/refer';
import {findNode} from './assistFunctions';
import {drawDragCanvas} from './drawCanvas';

const getDomOffset = dom => {
    const left = dom.offsetLeft,
        right = left + dom.offsetWidth,
        top = dom.offsetTop,
        bottom = top + dom.offsetHeight;
    return {left, right, top, bottom};
};

export default (mindmap, drag_canvas, container, theme, mindmapHook) => {
    const {moveNode} = mindmapHook;

    let node_id, parent_id, target_id, is_sibling,
        children, children_offset_left, children_offset_right, children_offset_vertical,
        parent_offset, parent_is_root,
        container_left, container_top,
        in_drop_area;

    const resetVariables = () => {
        node_id = '';
        parent_id = '';
        target_id = '';
        is_sibling = false;

        children = [];
        children_offset_left = [];
        children_offset_right = [];
        children_offset_vertical = [];

        parent_offset = undefined;
        parent_is_root = false;

        container_left = container.scrollLeft;
        container_top = container.scrollTop - 56;

        in_drop_area = false;
    };

    const handleContainerScroll = function () {
        container_left = this.scrollLeft;
        container_top = this.scrollTop - 56; // 56 是 container（Main 组件）顶部 margin 值
    };

    return [
        {
            type: 'dragstart',
            listener: event => {
                resetVariables();
                container.addEventListener('scroll', handleContainerScroll);
                if (event.target && (event.target.dataset.tag === refer.LEFT_NODE || event.target.dataset.tag === refer.RIGHT_NODE)) {
                    node_id = event.target.id;
                    parent_id = event.target.dataset.parent;
                    const parent = findNode(mindmap, parent_id);
                    parent_is_root = parent === mindmap;
                    parent_offset = getDomOffset(document.getElementById(parent_id));
                    children[0] = parent.children.map(child => child.id);
                    let children_offset = [];
                    children_offset[0] = children[0].map(node_id => getDomOffset(document.getElementById(node_id)));
                    if (parent_is_root && mindmap.children.length > 3) {
                        const half = Math.trunc(mindmap.children.length / 2);
                        children = [children[0].slice(0, half), children[0].slice(half)];
                        children_offset = [children_offset[0].slice(0, half), children_offset[0].slice(half)];
                    }
                    children_offset_left = children_offset.map(each => Math.min(...each.map(offset => offset.left)));
                    children_offset_right = children_offset.map(each => Math.max(...each.map(offset => offset.right)));
                    children_offset_vertical = children_offset.map(each => each.map(offset => [offset.top, offset.bottom]).reduce((flat_arr, cur) => flat_arr.concat(cur), []));
                }
            }
        },
        {
            type: 'drag',
            listener: event => {
                const ctx = drag_canvas.getContext('2d');
                ctx.clearRect(0, 0, drag_canvas.width, drag_canvas.height);
                const total = children.length;
                const mouse_x = event.x + container_left,
                    mouse_y = event.y + container_top;
                for (let i = 0; i < total; i++) {
                    if (!in_drop_area && mouse_x > children_offset_left[i] && mouse_x < children_offset_right[i]) {
                        const child_left_of_parent = i === 1 || (!parent_is_root && (document.getElementById(node_id).dataset.tag === refer.LEFT_NODE)); // i = 1，即出现双侧拖拽时，左侧发生的拖拽 child_left_of_parent 必然为 true
                        const last_index = children_offset_vertical[i].length - 1;
                        if (mouse_y > children_offset_vertical[i][0] - 100 && mouse_y < children_offset_vertical[i][0]) { // 优化体验，实际是显示的 2 倍
                            drawDragCanvas(ctx, theme, node_id, parent_offset, children_offset_left[i], children_offset_right[i], children_offset_vertical[i][0] - 50, children_offset_vertical[i][0], child_left_of_parent);
                            target_id = children[i][0];
                            is_sibling = true;
                            return;
                        }
                        for (let j = 2; j < last_index + 1; j += 2) {
                            if (mouse_y > children_offset_vertical[i][j - 1] && mouse_y < children_offset_vertical[i][j]) {
                                drawDragCanvas(ctx, theme, node_id, parent_offset, children_offset_left[i], children_offset_right[i], children_offset_vertical[i][j - 1], children_offset_vertical[i][j], child_left_of_parent);
                                target_id = children[i][j / 2];
                                is_sibling = true;
                                return;
                            }
                        }
                        if (mouse_y > children_offset_vertical[i][last_index] && mouse_y < children_offset_vertical[i][last_index] + 100) {
                            drawDragCanvas(ctx, theme, node_id, parent_offset, children_offset_left[i], children_offset_right[i], children_offset_vertical[i][last_index], children_offset_vertical[i][last_index] + 50, child_left_of_parent);
                            target_id = children[i + 1] && children[i + 1][0];
                            is_sibling = true;
                            return;
                        }
                    }
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
                    target_id = event.target.parentNode.id;
                    is_sibling = false;
                    in_drop_area = true;
                }
            }
        },
        {
            type: 'dragleave',
            listener: event => {
                if (event.target && event.target.dataset.tag === refer.DROP_AREA) {
                    event.target.parentNode.classList.remove('ondrag');
                    target_id = '';
                    is_sibling = false;
                    in_drop_area = false;
                }
            }
        },
        {
            type: 'drop',
            listener: event => {
                event.target.parentNode.classList.remove('ondrag');
                if (target_id !== '' && target_id !== node_id && target_id !== parent_id) {
                    moveNode(node_id, target_id, parent_id, is_sibling);
                }
            }
        },
        {
            type: 'dragend',
            listener: () => {
                const ctx = drag_canvas.getContext('2d');
                ctx.clearRect(0, 0, drag_canvas.width, drag_canvas.height);
                container.removeEventListener('scroll', handleContainerScroll);
            }
        }
    ];
}