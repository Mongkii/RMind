import React, {useState, useEffect, useRef, useContext} from 'react';
import {css} from 'emotion';
import {context} from '../context';
import Toolbar from '../components/Node/subComponents/Toolbar';
import InputDiv from '../components/Node/subComponents/InputDiv';
import useMindmap from "../customHooks/useMindmap";

const Node = ({layer, node, node_refs, parent_id, left}) => {
    const self = useRef();

    const {toggleChildren, selectNode} = useMindmap();

    useEffect(() => {
        node_refs.add(self);
        return () => {
            node_refs.delete(self);
        }
    }, []);

    const {state: nodeStatus} = useContext(context).nodeStatus;

    if (nodeStatus.cur_select === node.id) {
        self.current.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
    }

    return (<div className={left ? left_css : wrapper}>
        <div className={parent + ' ' + (nodeStatus.cur_select === node.id ? testt : '')+' '+(layer===1?big:'')+' '+(layer>1?small:'')+' '+(layer>2?ultra_small:'')} onClick={event => {
            selectNode(node.id);
            event.stopPropagation();
        }} draggable={true} data-tag={left ? 'left' : 'right'} data-parent={parent_id}
             data-show-children={node.showChildren} id={node.id} ref={self}>
            {nodeStatus.cur_edit === node.id && (<InputDiv node_id={node.id} defaultValue={node.text}/>)}
            <div className={select_preventer} data-tag='dragArea'/>
            <p>{node.text}</p>
            {(node.children.length > 0 && layer > 0) &&
            <button className={collapse_button + ' ' + (left ? button_left : button_right)} onClick={event => {
                toggleChildren(node.id, !node.showChildren);
                event.stopPropagation();
            }}>{node.showChildren ? '-' : '+'}</button>}
            {nodeStatus.cur_select === node.id && <Toolbar node={node} parent_id={parent_id}/>}</div>
        {layer>0 && <div className={children}>{node.showChildren && (node.children.map(sub_node => <Node key={sub_node.id}
                                                                                              layer={layer + 1}
                                                                                              node={sub_node}
                                                                                              node_refs={node_refs}
                                                                                              parent_id={node.id}
                                                                                              left={left}/>))}</div>}
    </div>);
};

export default Node;

// CSS
const wrapper = css`
display: flex;
align-items: center;
`;

const left_css = css`
display: flex;
align-items: center;
flex-direction: row-reverse;
`;

const testt = css`
z-index: 5;
`;

const big = css`
background-color: antiquewhite !important;
`;

const small = css`
padding: 10px 15px !important;
`;

const ultra_small = css`
padding: 0 15px !important;
p {
font-size: 90%;
}
border: none !important;
`;

const parent = css`
max-width: 200px;
position: relative;
min-width: 10px;
margin: 20px 40px;
padding: 15px;
border: 1px solid orange;
border-radius: 15px;
cursor: pointer;
background-color: #ffffff;

p {
margin: 0;
line-height: 1.5em;
}

&:hover {
box-shadow: 0 0 5px orange;
}

&.ondrag {
background-color: orange;
p {
color: #ffffff;
}
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
top:0;
bottom: 0;
margin: auto 0;
width: 20px;
height: 20px;
text-align: center;
border-radius: 50%;
outline: none;
`;

const button_left = css`
left: -10px;
`;

const button_right = css`
right: -10px;
`;

const children = css`

`;