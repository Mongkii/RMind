const exportNodeToText = (node, layer, format) => {
    switch (format) {
        case 'MD':
            if (layer < 6) {
                return '#'.repeat(layer + 1) + ' ' + node.text;
            }
            return '\t'.repeat(layer - 6) + '- ' + node.text;
        case 'TXT':
            return '\t'.repeat(layer) + node.text;
        default:
            return;
    }
};

const exportMindmapToText = (mindmap, format) => {
    let lines = [];
    const dfs = (node, layer, format) => {
        if (!node) {
            return;
        }
        lines.push(exportNodeToText(node, layer, format));
        node.children.forEach(child => {
            dfs(child, layer + 1, format)
        });
    };
    dfs(mindmap, 0, format);
    return lines.join('\n');
};

const copyNodeData = (format, target_node, source_node) => {
    switch (format) {
        case 'KM':
            target_node.data = {};
            target_node.data.id = source_node.id;
            target_node.data.created = Date.now();
            target_node.data.text = source_node.text;
            target_node.data.expandState = source_node.showChildren ? 'expand' : 'collapse';
            target_node.children = source_node.children.map(child => copyNodeData(format, {}, child));
            return target_node;
        default:
            return;
    }
};

const exportMindmapToJSON = (mindmap, format) => {
    switch (format) {
        case 'KM':
            const km_mindmap = {root: copyNodeData(format, {}, mindmap)};
            return JSON.stringify(km_mindmap);
        default:
            return;
    }
};

export default (mindmap, format) => {
    let export_data;
    switch (format) {
        case 'MD':
        case 'TXT':
            export_data = exportMindmapToText(mindmap, format);
            break;
        default:
            export_data = exportMindmapToJSON(mindmap, format);
            break;
    }
    return export_data;
}
