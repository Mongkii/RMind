import React, { useEffect, useContext, useRef, useMemo, useState } from 'react';
import { css } from 'emotion';
import * as refer from '../../statics/refer';
import { context } from '../../context/';
import { setHistory } from '../../context/reducer/history/actionCreator';
import useMindmap from '../../customHooks/useMindmap';
import useHistory from '../../customHooks/useHistory';
import getKeydownEvent from '../../methods/getKeydownEvent';
import getMouseWheelEvent from '../../methods/getMouseWheelEvent';
import RootNode from '../../components/RootNode';
import DragCanvas from '../../components/DragCanvas';
import LineCanvas from '../../components/LineCanvas';
import useZoom from '../../customHooks/useZoom';
import useMove from '../../customHooks/useMove';
import { debounce } from '../../methods/assistFunctions';

const node_refs = new Set();

const Mindmap = ({ container_ref }) => {
    const self = useRef();
    const { mindmap: { state: root_node }, nodeStatus: { state: nodeStatus }, history: { dispatch: hDispatch }, global: { state: gState } } = useContext(context);

    const historyHook = useHistory();
    const mindmapHook = useMindmap();
    const zoomHook = useZoom();
    const moveHook = useMove()
    const { clearNodeStatus } = mindmapHook;
    const [FLAG, setFLAG] = useState(0)

    const mindmap_json = useMemo(() => JSON.stringify(root_node), [root_node]); // 如果 root_node 没有 JSON.stringify，使用按键操作时有时会连续两次触发 useEffect，目前没查出来为什么。利用 useMemo 避免重复触发

    const handleResize = () => {
        setFLAG(Date.now())
    }

    useEffect(() => {
        const handleKeydown = getKeydownEvent(nodeStatus, mindmapHook, historyHook);
        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        }
    }, [nodeStatus]);

    useEffect(() => {
        window.addEventListener('click', clearNodeStatus);
        return () => {
            window.removeEventListener('click', clearNodeStatus);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    useEffect(() => {
        const normalizeXY = container_ref.current.clientWidth / container_ref.current.clientHeight
        const handleMouseWheel = getMouseWheelEvent(zoomHook, gState.zoom)
        const handleMapMove = getMouseWheelEvent(moveHook, gState.zoom, normalizeXY)
        document.querySelector(`#${refer.MINDMAP_MAIN}`).addEventListener('wheel', handleMouseWheel);
        document.querySelector(`#${refer.MINDMAP_MAIN}`).addEventListener('mousemove', debounce(handleMapMove, 4));
        document.querySelector(`#${refer.MINDMAP_MAIN}`).addEventListener('mousedown', handleMapMove)
        return () => {
            document.querySelector(`#${refer.MINDMAP_MAIN}`).removeEventListener('wheel', handleMouseWheel);
            document.querySelector(`#${refer.MINDMAP_MAIN}`).addEventListener('mousemove', debounce(handleMapMove, 4));
            document.querySelector(`#${refer.MINDMAP_MAIN}`).addEventListener('mousedown', handleMapMove);
        }
    }, [FLAG]);

    useEffect(() => {
        localStorage.setItem('mindmap', mindmap_json);
        hDispatch(setHistory(mindmap_json, nodeStatus.cur_select || nodeStatus.cur_edit));
    }, [mindmap_json]);

    return (
        <div
            className={wrapper}
            ref={self}
            style={{ zoom: gState.zoom, left: gState.x + 'vw', top: gState.y + 'vh' }}
            id={refer.MINDMAP_ID}
            draggable={false}>
            <RootNode key={root_node.id} layer={0} node={root_node} node_refs={node_refs} />
            <DragCanvas parent_ref={self} container_ref={container_ref} mindmap={root_node} />
            <LineCanvas parent_ref={self} mindmap={root_node} node_refs={node_refs} />
        </div>
    );
};

export default Mindmap;

// CSS
const wrapper = css`
position: relative;
width: fit-content;
padding: 30vh 30vw;
`;