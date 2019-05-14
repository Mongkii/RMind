import * as refer from '../statics/refer';

const drawBezier = (ctx, from_x, from_y, to_x, to_y) => {
    ctx.moveTo(from_x, from_y);
    ctx.bezierCurveTo(from_x, to_y, 0.9 * to_x + 0.1 * from_x, to_y, to_x, to_y);
};

const drawLine = (ctx, node, map) => {
    const {id: parent_id, children} = node;
    if (children.length > 0) {
        const [parent_x_left, parent_x_right, parent_y] = map.get(parent_id);
        children.forEach(child => {
            const child_data = map.get(child.id);
            if (child_data) {
                const [child_x_left, child_x_right, child_y, child_type] = child_data;
                if (child_type === refer.LEFT_NODE) {
                    drawBezier(ctx, parent_x_left, parent_y,child_x_right,child_y);
                    //ctx.moveTo(parent_x_left, parent_y);
                    //ctx.bezierCurveTo(parent_x_left, child_y, 0.9 * child_x_right + 0.1 * parent_x_left, child_y, child_x_right, child_y);
                } else {
                    drawBezier(ctx, parent_x_right, parent_y,child_x_left,child_y);
                    //ctx.moveTo(parent_x_right, parent_y);
                    //ctx.bezierCurveTo(parent_x_right, child_y, 0.9 * child_x_left + 0.1 * parent_x_right, child_y, child_x_left, child_y);
                }
                drawLine(ctx, child, map);
            }
        })
    }
};

// getElementById 版本。没有使用 Map 和 Set，不知道效率更高还是低
/*
const drawLine = (ctx, node) => {
    const {id: parent_id, showChildren, children} = node;
    if (showChildren && children.length > 0) {
        const parent = document.getElementById(parent_id), // querySelector 不能获取以数字开头的 id
            parent_x_left = parent.offsetLeft,
            parent_x_right = parent_x_left + parent.offsetWidth,
            parent_y = parent.offsetTop + 0.5 * parent.offsetHeight;
        console.log(parent_x_left, parent_x_right, parent_y);
        children.forEach(child => {
            const child_el = document.getElementById(child.id);
            if (child_el) {
                const child_x_left = child_el.offsetLeft,
                    child_x_right = child_x_left+child_el.offsetWidth,
                    child_y = child_el.offsetTop + 0.5 * child_el.offsetHeight,
                    child_type = child_el.dataset.tag;
                if (child_type === refer.LEFT_NODE) {
                    ctx.moveTo(parent_x_left, parent_y);
                    ctx.bezierCurveTo(parent_x_left, child_y, 0.9 * child_x_right + 0.1 * parent_x_left, child_y, child_x_right, child_y);
                } else {
                    ctx.moveTo(parent_x_right, parent_y);
                    ctx.bezierCurveTo(parent_x_right, child_y, 0.9 * child_x_left + 0.1 * parent_x_right, child_y, child_x_left, child_y);
                }
                drawLine(ctx, child);
            }
        })
    }
};
 */

const drawLineCanvas = (ctx, mindmap, map) => {
    ctx.beginPath();
    ctx.lineWidth = '2';
    ctx.strokeStyle = 'orange';
    //drawLine(ctx, node_relation);
    drawLine(ctx, mindmap, map);
    ctx.stroke();
    ctx.closePath();
};

const drawDragCanvas = (ctx, child_id, parent_rect, children_rect_left, children_rect_right, children_rect_top, children_rect_bottom,child_left_of_parent)=> {
    const virtual_rect_width= 50,
        virtual_rect_height= 20;
    ctx.beginPath();
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = '2';
    ctx.setLineDash([5, 5]);
    let parent_x,
        parent_y = (parent_rect.top + parent_rect.bottom) / 2,
        child_x,
        child_y = (children_rect_top + children_rect_bottom) / 2;
    if (child_left_of_parent) {
        parent_x = parent_rect.left;
        child_x = children_rect_right;
        ctx.strokeRect(child_x - virtual_rect_width, child_y - virtual_rect_height/2, virtual_rect_width, virtual_rect_height);
    } else {
        parent_x = parent_rect.right;
        child_x = children_rect_left;
        ctx.strokeRect(child_x, child_y - virtual_rect_height/2, virtual_rect_width, virtual_rect_height);
    }
    drawBezier(ctx, parent_x, parent_y, child_x, child_y);
    //ctx.moveTo(parent_x, parent_y);
    //ctx.bezierCurveTo(parent_x, child_y, 0.9 * child_x + 0.1 * parent_x, child_y, child_x, child_y);
    ctx.stroke();
    ctx.closePath();
};

export {drawLineCanvas, drawDragCanvas, drawBezier}