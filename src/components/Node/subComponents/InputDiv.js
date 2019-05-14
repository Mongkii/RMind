import React, {useEffect, useRef} from 'react';
import {css} from 'emotion';
import useMindmap from '../../../customHooks/useMindmap';
import {handlePropagation} from '../../../methods/assistFunctions';

const InputDiv = ({node_id, children}) => {
    const self = useRef();
    const {changeText, selectNode} = useMindmap();

    const handleKeydown = event => {
        switch (event.key.toUpperCase()) {
            case 'ESCAPE':
                self.current.textContent = children;
            case 'ENTER':
                self.current.blur();
                break;
            default:
                break;
        }
    };

    const handleBlur = () => {
        changeText(node_id, self.current.textContent);
        selectNode(node_id);
    };

    useEffect(() => {
        self.current.focus();
        const selection = document.getSelection();
        selection.selectAllChildren(self.current);
    }, []);

    return (<div className={wrapper} ref={self} contentEditable="true" suppressContentEditableWarning="true"
                 onClick={handlePropagation} onKeyDown={handleKeydown} onBlur={handleBlur}>{children}</div>);
};

export default InputDiv;

// CSS
const wrapper = css`
position: absolute;
top: 0;
bottom: 0;
left: 0;
right: 0;
width: fit-content;
min-width: 1em;
max-width: 10em;
height: fit-content;
margin: auto;
padding: 10px;
color: #333333;
background-color: #ffffff;
box-shadow: 0 0 20px #aaaaaa;
border-radius: 5px;
outline: none;
z-index: 3;
user-select: text;
`;