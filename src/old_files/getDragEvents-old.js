import * as refer from '../statics/refer';
import {findNode} from '../methods/assistFunctions';
import {drawDragCanvas} from '../methods/drawCanvas';

export default (root_node, drag_canvas_ref, mindmap_edit_actions) => {
    const {moveNode} = mindmap_edit_actions;

    let node_id, parent_id, target_id, is_sibling,
        children, children_rect_left, children_rect_right, children_rect_vertical,
        parent_rect, parent_is_root,
        in_drop_area,
        drag_canvas;

    const resetVariables = () => {
        node_id = '';
        parent_id = '';
        target_id = '';
        is_sibling = false;

        children = [];
        children_rect_left = [];
        children_rect_right = [];
        children_rect_vertical = [];

        parent_rect = undefined;
        parent_is_root = false;

        in_drop_area = false;

        drag_canvas = undefined;
    };

    return [
        {
            type: 'dragstart',
            listener: event => {
                resetVariables();
                drag_canvas = drag_canvas_ref.current;
                if (event.target && (event.target.dataset.tag === refer.LEFT_NODE || event.target.dataset.tag === refer.RIGHT_NODE)) {
                    node_id = event.target.id;
                    parent_id = event.target.dataset.parent;
                    const parent = findNode(root_node, parent_id);
                    parent_is_root = parent === root_node;
                    parent_rect = document.getElementById(parent_id).getBoundingClientRect();
                    children[0] = parent.children.map(child => child.id);
                    let client_rect = [];
                    client_rect[0] = children[0].map(node_id => document.getElementById(node_id).getBoundingClientRect());
                    if (parent_is_root && root_node.children.length > 3) {
                        const half = Math.trunc(root_node.children.length / 2);
                        children = [children[0].slice(0, half), children[0].slice(half)];
                        client_rect = [client_rect[0].slice(0, half), client_rect[0].slice(half)];
                    }
                    children_rect_left = client_rect.map(each => Math.min(...each.map(rect => rect.left)));
                    children_rect_right = client_rect.map(each => Math.max(...each.map(rect => rect.right)));
                    children_rect_vertical = client_rect.map(each => each.map(rect => [rect.top, rect.bottom]).reduce((flat_arr, cur) => flat_arr.concat(cur), []));
                }
            }
        },
        {
            type: 'drag',
            listener: event => {
                const ctx = drag_canvas.getContext('2d');
                ctx.clearRect(0, 0, drag_canvas.width, drag_canvas.height);
                if (!in_drop_area && event.x > children_rect_left[0] && event.x < children_rect_right[0]) {
                    const child_left_of_parent = !parent_is_root && (document.getElementById(node_id).dataset.tag === refer.LEFT_NODE);
                    const last_index = children_rect_vertical[0].length - 1;
                    if (event.y > children_rect_vertical[0][0] - 100 && event.y < children_rect_vertical[0][0]) { // 优化体验，实际是显示的 2 倍
                        drawDragCanvas(ctx, node_id, parent_rect, children_rect_left[0], children_rect_right[0], children_rect_vertical[0][0] - 50, children_rect_vertical[0][0], child_left_of_parent);
                        target_id = children[0][0];
                        is_sibling = true;
                        return;
                    }
                    for (let i = 2; i < children_rect_vertical[0].length; i += 2) {
                        if (event.y > children_rect_vertical[0][i - 1] && event.y < children_rect_vertical[0][i]) {
                            drawDragCanvas(ctx, node_id, parent_rect, children_rect_left[0], children_rect_right[0], children_rect_vertical[0][i - 1], children_rect_vertical[0][i], child_left_of_parent);
                            target_id = children[0][i / 2];
                            is_sibling = true;
                            return;
                        }
                    }
                    if (event.y > children_rect_vertical[0][last_index] && event.y < children_rect_vertical[0][last_index] + 100) {
                        drawDragCanvas(ctx, node_id, parent_rect, children_rect_left[0], children_rect_right[0], children_rect_vertical[0][last_index], children_rect_vertical[0][last_index] + 50, child_left_of_parent);
                        target_id = children[1] && children[1][0];
                        is_sibling = true;
                    }
                } else if (!in_drop_area && children[1] && event.x > children_rect_left[1] && event.x < children_rect_right[1]) {
                    const last_index = children_rect_vertical[1].length - 1;
                    if (event.y > children_rect_vertical[1][0] - 100 && event.y < children_rect_vertical[1][0]) {
                        drawDragCanvas(ctx, node_id, parent_rect, children_rect_left[1], children_rect_right[1], children_rect_vertical[1][0] - 50, children_rect_vertical[1][0], true); // 出现双侧拖拽时，左侧发生的拖拽 child_left_of_parent 必然为 true
                        target_id = children[1][0];
                        is_sibling = true;
                        return;
                    }
                    for (let i = 2; i < children_rect_vertical[1].length; i += 2) {
                        if (event.y > children_rect_vertical[1][i - 1] && event.y < children_rect_vertical[1][i]) {
                            drawDragCanvas(ctx, node_id, parent_rect, children_rect_left[1], children_rect_right[1], children_rect_vertical[1][i - 1], children_rect_vertical[1][i], true);
                            target_id = children[1][i / 2];
                            is_sibling = true;
                            return;
                        }
                    }
                    if (event.y > children_rect_vertical[1][last_index] && event.y < children_rect_vertical[1][last_index] + 100) {
                        drawDragCanvas(ctx, node_id, parent_rect, children_rect_left[1], children_rect_right[1], children_rect_vertical[1][last_index], children_rect_vertical[1][last_index] + 50, true);
                        target_id = undefined;
                        is_sibling = true;
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
                const ctx = drag_canvas.getContext('2d');
                ctx.clearRect(0, 0, drag_canvas.width, drag_canvas.height);
                event.target.parentNode.classList.remove('ondrag');
                if (target_id !== '' && target_id !== node_id && target_id !== parent_id) {
                    moveNode(node_id, target_id, parent_id, is_sibling);
                }
            }
        }
    ];
}