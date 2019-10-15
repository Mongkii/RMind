import * as actionTypes from './actionTypes';

export const toggelPanelShow = (isShow) => ({
    type: actionTypes.TOGGLE_PANEL_SHOW,
    data: {
        isShow,
    }
});


// export const openPanel = theme_index => ({
//     type: actionTypes.OPEN_PANEL,    
// });