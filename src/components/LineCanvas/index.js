import React, {useState, useEffect, useRef, useContext} from 'react';
import {css} from 'emotion';
import useTheme from '../../customHooks/useTheme';
import {context} from '../../context'
import {drawLineCanvas} from '../../methods/drawCanvas';

const LineCanvas = ({parent_ref, mindmap, node_refs}) => {
    const self = useRef();
    const [flag, setFlag] = useState(0);

    const {theme} = useTheme();
    const {global:{state:gState}}=useContext(context);

    const handleWindowResize = (e) => {
        e.preventDefault()
        setFlag(Date.now());
        console.log('resize',e)
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, []);

    useEffect(() => {
        const dom = self.current;
        dom.width = parent_ref.current.offsetWidth;
        dom.height = parent_ref.current.offsetHeight; // 重新设置 canvas 大小，也兼具清除画板的作用
        const map = new Map(Array.from(node_refs).map(ref => [ref.current.id, [(ref.current.offsetLeft), (ref.current.offsetLeft + ref.current.offsetWidth), (ref.current.offsetTop + 0.5 * ref.current.offsetHeight), ref.current.dataset.tag]]));
        const ctx = dom.getContext('2d');
        drawLineCanvas(ctx, theme, mindmap, map);
    }, [mindmap, theme, flag,gState.zoom]);

    return (<canvas ref={self} className={wrapper} />);
};

export default LineCanvas;

// CSS
const wrapper = css`
position: absolute;
top:0;
left:0;
z-index: -2;
`;