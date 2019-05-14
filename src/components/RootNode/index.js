import React, {useEffect, useRef} from 'react';
import {css} from 'emotion';
import {ROOT_PARENT} from '../../statics/refer';
import Node from '../Node';
import SubNode from '../SubNode';

const RootNode = ({layer, node, node_refs}) => {
    const root_node = useRef();

    const total = node.children.length,
        half = total > 3 ? Math.trunc(total / 2) : total;

    // 载入时使根节点居中。暂时没发现除了多包一层 div 之外更好的解决方法
    useEffect(() => {
        root_node.current.scrollIntoView({block: 'center', inline: 'center'});
    }, []);

    return (<div className={wrapper}>
        <div>
            {node.showChildren && node.children.slice(half).map(sub_node => <SubNode
                key={sub_node.id}
                layer={layer + 1}
                node={sub_node}
                node_refs={node_refs}
                parent={node} on_left={true} />)}
        </div>
        <div ref={root_node}>
            <Node layer={0} node={node} node_refs={node_refs} parent={ROOT_PARENT} />
        </div>
        <div>
            {node.showChildren && node.children.slice(0, half).map(sub_node => <SubNode
                key={sub_node.id}
                layer={layer + 1}
                node={sub_node}
                node_refs={node_refs}
                parent={node}
                on_left={false} />)}
        </div>
    </div>);
};

export default RootNode;

// CSS
const wrapper = css`
display: flex;
align-items: center;
width: max-content; /* max-content 才能保证正确读取布局 */
`;