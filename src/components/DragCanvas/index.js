import React, {useState, useEffect, useRef} from 'react';
import {css} from 'emotion';
import useMindmap from '../../customHooks/useMindmap';
import useTheme from '../../customHooks/useTheme';
import getDragEvents from '../../methods/getDragEvents';

const DragCanvas = ({parent_ref, container_ref, mindmap}) => {
    const self = useRef();
    const [flag, setFlag] = useState(0);

    const {theme} = useTheme();

    const mindmapHook = useMindmap();

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
        const handleDrag = getDragEvents(mindmap, self.current, container_ref.current, theme, mindmapHook);
        handleDrag.forEach(event => window.addEventListener(event.type, event.listener));
        return () => {
            handleDrag.forEach(event => window.removeEventListener(event.type, event.listener));
        }
    }, [mindmap, theme]);

    useEffect(() => {
        const dom = self.current;
        dom.width = parent_ref.current.offsetWidth;
        dom.height = parent_ref.current.offsetHeight;
    }, [mindmap, flag]);

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