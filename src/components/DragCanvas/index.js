import React, { useState, useEffect, useRef, useContext } from 'react';
import { css } from 'emotion';
import useMindmap from '../../customHooks/useMindmap';
import useTheme from '../../customHooks/useTheme';
import getDragEvents from '../../methods/getDragEvents';
import { context } from '../../context'
import * as refer from '../../statics/refer';

const DragCanvas = ({ parent_ref, container_ref, mindmap }) => {
    const self = useRef();
    const [flag, setFlag] = useState(0);

    const { theme } = useTheme();

    const mindmapHook = useMindmap();

    const { global: { state: gState } } = useContext(context);
    const {zoom,x,y}=gState

    const handleWindowResize = () => {
        setFlag(Date.now());
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, []);

    useEffect(() => {
        const handleDrag = getDragEvents(mindmap, self.current, container_ref.current, theme, mindmapHook,zoom,{x,y});
        handleDrag.forEach(event => document.querySelector(`#${refer.MINDMAP_ID}`).addEventListener(event.type, event.listener));
        return () => {
            handleDrag.forEach(event => document.querySelector(`#${refer.MINDMAP_ID}`).removeEventListener(event.type, event.listener));
        }
    }, [mindmap, theme,zoom,x,y]);

    useEffect(() => {
        const dom = self.current;
        dom.width = parent_ref.current.offsetWidth;
        dom.height = parent_ref.current.offsetHeight;
    }, [mindmap, flag, gState.zoom]);

    return (<canvas ref={self} className={wrapper} />);
};

export default DragCanvas;

// CSS
const wrapper = css`
position: absolute;
top:0;
left:0;
z-index: -1;
`;