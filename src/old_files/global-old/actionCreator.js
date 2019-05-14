import * as actionTypes from './actionTypes';

export const setTitle = (title) => ({
    type: actionTypes.SET_TITLE,
    data: {
        title
    }
});

export const setTheme = (theme_index) => ({
    type: actionTypes.SET_THEME,
    data: {
        theme_index
    }
});

export const temp = (arr) => ({
    type: actionTypes.TEMP,
    data: {
        main: arr[0],
        light: arr[1],
        dark: arr[2],
        ex: arr[3],
        assist: arr[4]
    }
});