import React from 'react';
import {css} from 'emotion';
import useTheme from '../../customHooks/useTheme';
import * as refer from '../../statics/refer';

const ThemeProvider = ({children}) => {
    const {theme} = useTheme();

    return (<div className={css`
    ${refer.THEME_MAIN}: ${theme.main};
    ${refer.THEME_LIGHT}: ${theme.light};
    ${refer.THEME_ASSIST}: ${theme.assist};
    ${refer.THEME_DARK}: ${theme.dark};
    ${refer.THEME_EX}: ${theme.ex};
    `}>
        {children}
    </div>);
};

export default ThemeProvider;