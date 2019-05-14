import React from 'react';
import {css, cx} from 'emotion';

const ThemeListItem = ({theme,index, is_current, setTheme }) => {
    const handleSetTheme = ()=>{
        setTheme(index);
    };

    return (<li className={cx(wrapper, {[current_style]: is_current})} onClick={handleSetTheme}>
        <div style={{backgroundColor:theme.ex}}/>
        <div style={{backgroundColor:theme.dark}}/>
        <div style={{backgroundColor:theme.main}}/>
        <div style={{backgroundColor:theme.light}}/>
    </li>);
};

export default ThemeListItem;

// CSS

const wrapper = css`
box-sizing: border-box;
display: flex;
width: 47%;
height: 25px;
margin: 8px 0;
border-radius: 18px;
cursor: pointer;
overflow: hidden;

div {
z-index: -1;
flex: 1;
}
`;

const current_style = css`
box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px #000000; /* 两层阴影实现框选效果，也可用 inset 阴影 + border-color 做 */
`;



/*
const wrapper = css`
box-sizing: border-box;
box-shadow: 0 0 0 5px #ffffff inset;
display: flex;
width: 49%;
height: 36px;
margin: 5px 0;
padding: 5px;
border: 2px solid transparent;
border-radius: 18px;
cursor: pointer;

div {
z-index: -1;
flex: 1;
}
`;

const current_style = css`
border-color: #000000;
`;
*/
