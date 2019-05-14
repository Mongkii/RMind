import React, {useState, useEffect, useRef, useContext} from 'react';
import {css} from 'emotion';
import {context} from '../context';
import * as actionCreator from '../context/reducer/mindmap/actionCreator';
import Toolbar from '../components/Node/subComponents/Toolbar';
import InputDiv from '../components/Node/subComponents/InputDiv';
import Node from '../components/Node';
import useMindmap from '../customHooks/useMindmap';

const RootNodeOld = ({layer, node, dispatch, medit, node_refs, parent_id, left}) => {
    const self = useRef();

    const {selectNode} = useMindmap();

    useEffect(() => {
        node_refs.add(self);
        return () => {
            node_refs.delete(self);
        }
    }, []);

    const l = node.children.length,
        half = l>3?Math.trunc(l / 2):l;

    const {nodeStatus:{state:g_state, dispatch: g_dispatch},mindmap:{dispatch: m_dispatch}} = useContext(context);

    return (<div className={wrapper}>
        <div className={children}>{node.showChildren && (node.children.slice(half, l).map(sub_node => <Node
            key={sub_node.id}
            layer={layer + 1}
            node={sub_node}
            dispatch={dispatch}
            medit={medit} node_refs={node_refs}
            parent_id={node.id} left={true}/>))}</div>
        <div className={parent + ' ' + (g_state.cur_select === node.id ? testt : undefined)} onClick={event => {
            selectNode(node.id);
            event.stopPropagation();
        }} ref={self} id={node.id}>
            {g_state.cur_edit === node.id && <InputDiv node_id={node.id} defaultValue={node.text}/>}
                <div className={select_preventer}/>
                <p>{node.text}</p>
            {(node.children.length > 0 && layer > 0) && <button className={collapse_button} onClick={event => {
                medit(actionCreator.toggleChildren(node.id, !node.showChildren));
                event.stopPropagation();
            }}>{node.showChildren ? '-' : '+'}</button>}
            {g_state.cur_select === node.id && <Toolbar node={node} parent_id={parent_id}/>}</div>
        <div className={children}>{node.showChildren && (node.children.slice(0, half).map(sub_node => <Node
            key={sub_node.id}
            layer={layer + 1}
            node={sub_node}
            dispatch={dispatch}
            medit={medit} node_refs={node_refs}
            parent_id={node.id}/>))}</div>
    </div>);
};

export default RootNodeOld;

// CSS
const wrapper = css`
display: flex;
align-items: center;
width: max-content; /* 重要，SubNode 写这个会导致排版有问题，但 RootNode 必须写 */
`;

const testt = css`
z-index: 5;
`;

const parent = css`
width: fit-content;
position: relative;
margin: 10px 20px;
padding: 15px 30px;
border: 3px solid darkorange;
border-radius: 15px;
cursor: pointer;
background-color: orange;
color: #ffffff;

p {
margin: 0;
line-height: 1.5em;
}

&:hover {
box-shadow: 0 0 5px orange;
}
`;

const select_preventer = css`
position: absolute;
top:0;
bottom:0;
left:0;
right:0;
`;

const collapse_button = css`
position: absolute;
right: -10px;
top:0;
bottom: 0;
margin: auto 0;
width: 20px;
height: 20px;
text-align: center;
border-radius: 50%;
outline: none;
`;

const children = css`

`;