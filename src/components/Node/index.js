import React, {useEffect, useRef, useContext} from 'react';
import {css, cx} from 'emotion';
import {context} from '../../context';
import useMindmap from "../../customHooks/useMindmap";
import {getNodeInfo} from '../../context/reducer/nodeStatus/actionCreator';
import * as refer from '../../statics/refer';
import {handlePropagation} from '../../methods/assistFunctions';
import Toolbar from './subComponents/Toolbar';
import InputDiv from './subComponents/InputDiv';
import MdPreview from '../mdPreview';

const Node = ({layer, node, parent, node_refs, on_left}) => {
    const self = useRef();
    const {nodeStatus: {state: nodeStatus, dispatch: nDispatch}, editPanel: {state:epState}} = useContext(context);
    const mindmapHook = useMindmap();


    const handleSelectNode = () => {
        mindmapHook.selectNode(node.id, true);
    };

    const handleEditNode = () => {
        mindmapHook.editNode(node.id);
    };

    const handleToggleChildren = () => {
        mindmapHook.toggleChildren(node.id, !node.showChildren);
        mindmapHook.clearNodeStatus(); // 避免出现当前选择的节点被隐藏后仍然可以操作的情况
    };

    useEffect(() => {
        node_refs.add(self);
        return () => {
            node_refs.delete(self);
        }
    }, []);

    useEffect(() => {
        if (nodeStatus.cur_select === node.id) {
            self.current.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
            nDispatch(getNodeInfo(node, parent, on_left));
        }
    }, [nodeStatus.cur_select, node]);

    // 为避免事件冒泡导致干扰，点击事件放在了 dropArea div，最外层 Node div 用于阻止冒泡
    return (<div
        className={cx(common_style, specific_style[layer < 3 ? layer : 3], {[seleted_style]: nodeStatus.cur_select === node.id})}
        draggable={layer > 0 && nodeStatus.cur_edit !== node.id}
        data-tag={on_left ? refer.LEFT_NODE : refer.RIGHT_NODE}
        data-parent={parent.id}
        data-show-children={node.showChildren}
        id={node.id}
        ref={self}
        onClick={handlePropagation}>
        {nodeStatus.cur_edit === node.id &&
        <InputDiv node_id={node.id}>{node.text}</InputDiv>}
        <div className={drop_area} data-tag={refer.DROP_AREA} onClick={handleSelectNode} onDoubleClick={handleEditNode} />
        <p>{node.text} {node.info && <MdPreview mdtext={node.info}/>}</p>
        {(layer > 0 && node.children.length > 0) &&
        <button className={cx(toggle_button, (on_left ? button_left : button_right))} onClick={handleToggleChildren}>{node.showChildren ? '-' : '+'}</button>}
        {(nodeStatus.cur_select === node.id && nodeStatus.select_by_click) && !epState.isShow &&
        <Toolbar layer={layer} node={node} parent={parent} />}
    </div>);
};

export default Node;

// CSS
const style_selected_border = `
box-shadow: 0 0 0 3px #ffffff, 0 0 0 6px var(${refer.THEME_EX}); /* 双层阴影实现选中框 */
`;

const common_style = css`
position: relative;
min-width: 10px;
max-width: 200px;
margin: 20px 40px;
padding: 15px;
background-color: #ffffff;
border: 1px solid var(${refer.THEME_MAIN});
border-radius: 15px;
cursor: pointer;

p {
min-height: 18px; /* 当 p 中没有内容时撑起元素 */
margin: 0;
line-height: 1.5em;
overflow-wrap: break-word;
}

&:hover {
${style_selected_border}
}

&.ondrag {
background-color: var(${refer.THEME_EX});
p {
color: #ffffff;
}
}
`;

const specific_style = [ // div&用于提高 CSS 权重
    css`
div& {
padding: 15px 20px;
color: #ffffff;
font-size: 120%;
font-weight: 700;
background-color: var(${refer.THEME_DARK});
border:2px solid var(${refer.THEME_EX});
}
    `,
    css`
div& {
background-color: var(${refer.THEME_LIGHT});
}
    `,
    css`
div& {
padding: 10px 15px;
}
    `,
    css`
div& {
padding: 0 15px;
border: none;
p {
font-size: 90%;
}
}
    `
];

const seleted_style = css`
z-index: 1; /* 提高 Node 高度，防止被遮挡 */
${style_selected_border}
`;

// 兼有防止文字被选中的功能
const drop_area = css`
position: absolute;
top:0;
bottom:0;
left:0;
right:0;
`;

const toggle_button = css`
position: absolute;
top:0;
bottom: 0;
width: 20px;
height: 20px;
margin: auto 0;
padding: 0;
text-align: center;
background-color: #ffffff;
border: 1px solid #cccccc;
border-radius: 50%;
outline: none;
`;

const button_left = css`
left: -15px;
`;

const button_right = css`
right: -15px;
`;