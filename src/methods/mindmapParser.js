import md5 from 'md5';
import * as refer from '../statics/refer';

const getLayerAndText = (line, format) => {
    let layer, text;
    switch (format) {
        case 'MD': {
            if (line.match(/^#{1,6} /)) {
                layer = line.match(/^#{1,6} /)[0].length - 2;
                text = line.replace(/^#{1,6} /, '');
            } else if (line.match(/^\s*[-*] /)) {
                layer = line.match(/^\s*[-*] /)[0].length + 4;
                text = line.replace(/^\s*[-*] /, '');
            }
            return {layer, text};
        }
        case 'TXT': {
            layer = line.match(/^\s*/)[0].length;
            text = line.replace(/^\s*/, '');
            return {layer, text};
        }
        default:
            return {layer, text};
    }
};

const buildNodeFromText = (data_array, format, cur_layer, cur_text = '') => {
    if (data_array.length === 0 && cur_layer === -1) {
        return;
    }
    if (cur_layer === -1) {
        const root_data = getLayerAndText(data_array.shift(), format);
        cur_layer = root_data.layer || 0; // 一定的鲁棒性
        cur_text = root_data.text || '未知数据';
    }
    const cur_node = {
        id: cur_layer === 0 ? refer.ROOT_NODE_ID : md5('' + Date.now() + Math.random() + cur_text),
        text: cur_text,
        showChildren: true,
        children: []
    };
    while (data_array.length > 0) {
        const {layer, text} = getLayerAndText(data_array[0], format);
        if (layer <= cur_layer) {
            break;
        }
        data_array.shift();
        if (layer) { // 排除掉无法匹配的情况
            cur_node.children.push(buildNodeFromText(data_array, format, layer, text));
        }
    }
    return cur_node;
};

const copyNodeData = (format, target_node, source_node, is_root_node) => {
    switch (format) {
        case 'KM':
            target_node.id = is_root_node ? refer.ROOT_NODE_ID : source_node.data.id;
            target_node.text = source_node.data.text;
            target_node.showChildren = source_node.data.expandState !== 'collapse';
            target_node.children = source_node.children.map(child => copyNodeData(format, {}, child));
            return target_node;
        default:
            return;
    }
};

const buildNodeFromJSON = (json, format) => {
    switch (format) {
        case 'RMF':
            return JSON.parse(json);
        case 'KM': {
            let km_mindmap = JSON.parse(json);
            return copyNodeData(format, {}, km_mindmap.root, true);
        }
        default:
            return;
    }
};

export default (import_data, format) => {
    let mindmap;
    switch (format) {
        case 'MD':
        case 'TXT':
            const data_array = import_data.split('\n').filter(line => line);
            mindmap = buildNodeFromText(data_array, format, -1);
            break;
        default:
            mindmap = buildNodeFromJSON(import_data, format);
            break;
    }
    return mindmap;
}