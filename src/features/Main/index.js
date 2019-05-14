import React, {useRef} from 'react';
import {css} from 'emotion';
import Mindmap from '../Mindmap';

const Main = () => {
    const self = useRef();

    return (<main ref={self} className={wrapper}><Mindmap container_ref={self} /></main>);
};

export default Main;

// CSS
const wrapper = css`
height: calc(100vh - 56px);
margin: 56px 0 0;
overflow: scroll;
`;