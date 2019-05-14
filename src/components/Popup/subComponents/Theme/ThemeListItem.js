import React from 'react';
import {css, cx} from 'emotion';

const ThemeListItem = ({theme, index, is_current, setTheme}) => {
    const handleSetTheme = () => {
        setTheme(index);
    };

    return (<li className={cx(wrapper, {[current_style]: is_current})} onClick={handleSetTheme}>
        <div style={{backgroundColor: theme.ex}} />
        <div style={{backgroundColor: theme.dark}} />
        <div style={{backgroundColor: theme.main}} />
        <div style={{backgroundColor: theme.light}} />
    </li>);
};

export default ThemeListItem;

// CSS

const wrapper = css`
display: flex;
box-sizing: border-box;
width: 47%;
height: 25px;
margin: 8px 0;
border-radius: 18px;
cursor: pointer;
overflow: hidden;

div {
flex: 1;
z-index: -1;
}
`;

const current_style = css`
box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px #000000; /* 两层阴影实现框选效果，也可用 inset 阴影 + border-color 做 */
`;
