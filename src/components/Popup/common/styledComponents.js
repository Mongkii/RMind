import React from 'react';
import {css} from 'emotion';
import * as refer from '../../../statics/refer';

export const ButtonSet = props => (<div {...props} className={css`
display: flex;
justify-content: flex-end;
margin-top: 20px;

button {
margin-left: 20px;
padding: 10px 20px;
background-color: #ffffff;
border-radius: 10px;
outline: none;
}

button:active {
transform: scale(0.95);
}
`} />);

export const MainButton = props => (<button {...props} className={css` /* button& 用于提高 CSS 权重 */
button& {
color: #ffffff;
background-color: var(${refer.THEME_DARK});
border: 1px solid var(${refer.THEME_MAIN});
}
`} />);

export const Highlight = props => (<p {...props} className={css`
margin-top: 0;
color: var(${refer.THEME_ASSIST});
font-weight: 700;
`} />);

export const Annotation = props => (<p {...props} className={css`
color: #888888;
font-size: 90%;
`} />);

export const Shortcut = props => (<a {...props} className={css`
text-decoration: underline;
cursor: pointer;
`} />);