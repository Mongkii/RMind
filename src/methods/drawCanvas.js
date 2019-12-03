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
                const [child_x_left, child_x_right, child_y, child_tag] = child_data;
                if (child_tag === refer.LEFT_NODE) {
                    drawBezier(ctx, parent_x_left, parent_y, child_x_right, child_y);
                } else {
                    drawBezier(ctx, parent_x_right, parent_y, child_x_left, child_y);
                }
                drawLine(ctx, child, map);
            }
        })
    }
};

export const drawLineCanvas = (ctx, theme, mindmap, map) => {
    ctx.beginPath();
    ctx.lineWidth = '2';
    ctx.strokeStyle = theme.main;
    drawLine(ctx, mindmap, map);
    ctx.stroke();
    ctx.closePath();
};

export const drawDragCanvas = (ctx, theme, child_id, parent_offset, child_offset, child_left_of_parent) => {
    const virtual_rect_width = 50,
        virtual_rect_height = 20;
    ctx.beginPath();
    ctx.strokeStyle = theme.main;
    ctx.lineWidth = '2';
    ctx.setLineDash([5, 5]);
    let parent_x,
        parent_y = (parent_offset.top + parent_offset.bottom) / 2,
        child_x,
        child_y = (child_offset.top + child_offset.bottom) / 2;
    if (child_left_of_parent) {
        parent_x = parent_offset.left;
        child_x = child_offset.right;
        ctx.strokeRect(child_x - virtual_rect_width, child_y - virtual_rect_height / 2, virtual_rect_width, virtual_rect_height);
    } else {
        parent_x = parent_offset.right;
        child_x = child_offset.left;
        ctx.strokeRect(child_x, child_y - virtual_rect_height / 2, virtual_rect_width, virtual_rect_height);
    }
    drawBezier(ctx, parent_x, parent_y, child_x, child_y);
    ctx.stroke();
    ctx.closePath();
};