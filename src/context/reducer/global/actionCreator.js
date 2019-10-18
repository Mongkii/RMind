import * as actionTypes from './actionTypes';

export const setTitle = title => ({
    type: actionTypes.SET_TITLE,
    data: {
        title
    }
});

export const setTheme = theme_index => ({
    type: actionTypes.SET_THEME,
    data: {
        theme_index
    }
});


export const zoomIn = zoomRate => ({
    type: actionTypes.ZOOM_IN,
    data: {
        zoomRate
    }
});

export const zoomOut = zoomRate => ({
    type: actionTypes.ZOOM_OUT,
    data: {
        zoomRate
    }
});

export const zoomReset = zoomRate => ({
    type: actionTypes.ZOOM_RESET,
    data: {
        zoomRate
    }
});