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


export const zoomIn = (x,y) => ({
    type: actionTypes.ZOOM_IN,
    data: {
        x,y
    }
});

export const zoomOut = (x,y) => ({
    type: actionTypes.ZOOM_OUT,
    data: {
        x,y
    }
});

export const zoomReset = zoomRate => ({
    type: actionTypes.ZOOM_RESET,
    data: {
        zoomRate
    }
});

export const moveReset = () => ({
    type: actionTypes.MOVE_RESET,
    data: {
    }
});

export const moveXY = (x,y) => ({
    type: actionTypes.MOVE_XY,
    data: {
        x,y
    }
});

export const moveXYWhenZoom = (x,y) => ({
    type: actionTypes.MOVE_XY,
    data: {
        x,y
    }
});


