import React, {useState, useEffect, useContext, useRef} from 'react';
import {css} from 'emotion';
import {context} from '../context';
import LineCanvas from '../components/LineCanvas';
import DragCanvas from '../components/DragCanvas';
import RootNode from '../components/RootNode';
import useMindmap from '../customHooks/useMindmap';
import getDragEvents from '../methods/getDragEvents';
import getKeydownEvent from '../methods/getKeydownEvent';
import * as refer from '../statics/refer';

const node_refs = new Set();

const Mindmap = ({container_ref}) => {
    const self = useRef();
    const drag_canvas_ref = useRef();
    const [mindmapSize, setMindmapSize] = useState({width:0,height:0}); // 初始值不能获取当前组件宽高
    const {mindmap: {state: root_node}, nodeStatus: {state: nodeStatus}} = useContext(context);

    const handleWindowResize = () => {
        const dom = self.current;
        setMindmapSize({width: dom.offsetWidth, height: dom.offsetHeight});
    };

    const mindmapEdit = useMindmap();
    const {clearNodeStatus} = mindmapEdit;

    useEffect(() => {
        const handleKeydown = getKeydownEvent(nodeStatus, mindmapEdit);
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        }
    }, [nodeStatus]);

    useEffect(() => {
        const handleDrag = getDragEvents(root_node, drag_canvas_ref,container_ref , mindmapEdit);
        handleDrag.forEach(event => window.addEventListener(event.type, event.listener));
        return () => {
            handleDrag.forEach(event => window.removeEventListener(event.type, event.listener));
        }
    }, [root_node]);

    useEffect(() => {
        handleWindowResize(); // 载入时需获取一次宽高
        window.addEventListener('click', () => {
            console.log('TOOLBAR HIDE');
            clearNodeStatus();
        });
        window.addEventListener('resize',handleWindowResize);
        return () => {
            window.removeEventListener('click', clearNodeStatus);
            window.removeEventListener('resize',handleWindowResize);
        }
    }, []);

    useEffect(() => {
        handleWindowResize(); // mindmap 改变时也需获取一次宽高
        const mindmap_data = JSON.stringify(root_node);
        localStorage.setItem('mindmap', mindmap_data);
        return () => {
            // console.log(mindmap_data);
        }
    }, [root_node]);

    return (
        <div className={wrapper} ref={self} id={refer.MINDMAP_ID}>
            <RootNode key={root_node.id} layer={0} node={root_node} node_refs={node_refs} />
            <DragCanvas ref={drag_canvas_ref} mindmap_size={mindmapSize}/>
            <LineCanvas node_refs={node_refs} mindmap={root_node} mindmap_size={mindmapSize}/>
        </div>
    );
};

export default Mindmap;

// CSS
const wrapper = css`
position: relative;
padding: 30vh 30vw;
width: fit-content;
`;