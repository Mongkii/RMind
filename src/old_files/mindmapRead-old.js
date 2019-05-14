/// 没有用的函数，可直接从 mindmap 查找元素
/*
export const buildRelation = node => {
    let children = [];
    for (let i = 0; i < node.children.length; i++) {
        const child = buildRelation(node.children[i]);
        children.push(child);
    }
    return {
        id: node.id,
        children: children
    };
};
 */

export const findNode = (node, search_id) => {
    if (node.id === search_id) {
        return node;
    }
    return node.children.map(child => findNode(child, search_id)).find(item => item);
};

export const saveMindmap = (mindmap) => {
    localStorage.setItem('mindmap', JSON.stringify(mindmap));
};

