import * as actionTypes from './actionTypes';
import * as refer from '../../../statics/refer';
import { deepCopy } from '../../../methods/assistFunctions';
import { debug } from 'util';

export const defaultValue_global = {
    title: localStorage.getItem('title') || refer.DEFAULT_TITLE,
    theme_index: Number(localStorage.getItem('theme_index')) || 0,
    theme_list: [
        { main: "#eda938", light: "#f4cc87", dark: "#e79021", ex: "#ce7529", assist: "#1980da" },
        { main: "#ff4c26", light: "#ffcabc", dark: "#e83f1d", ex: "#c12a0f", assist: "#0e95ac" },
        { main: "#50b843", light: "#c3e5bd", dark: "#28ab17", ex: "#038b00", assist: "#790595" },
        { main: "#2d99d7", light: "#e2f5ff", dark: "#2786c3", ex: "#2375af", assist: "#ca6c27" },
        { main: "#b347d2", light: "#e4c0ef", dark: "#a623c9", ex: "#9621c3", assist: "#009000" },
        { main: "#555555", light: "#e9e9e9", dark: "#434343", ex: "#262626", assist: "#860314" }
    ],
    zoom: 1,
    x:0,
    y:0,
};

const ZOOM_STEP=0.1;
const MOVE_STEP=0.1;

const preventMinValue=(obj,key,min)=>{
    
    if(obj[key]<=min){
        obj[key]=min
    }
}

export default (global, action) => {
    switch (action.type) {
        case actionTypes.SET_TITLE:
        case actionTypes.SET_THEME:
            return Object.assign(deepCopy(global), action.data);
        case actionTypes.ZOOM_IN: {
            const newGlobal = deepCopy(global)
            newGlobal.zoom += ZOOM_STEP;
            return newGlobal;
        }
        case actionTypes.ZOOM_OUT: {
            const newGlobal = deepCopy(global)
            newGlobal.zoom -= ZOOM_STEP;
            preventMinValue(newGlobal,'zoom', 0.3)
            return newGlobal;
        }
        case actionTypes.ZOOM_RESET: {
            const newGlobal = deepCopy(global)
            newGlobal.zoom = 1;
            return newGlobal;
        }        
        case actionTypes.MOVE_XY: {
            const newGlobal = deepCopy(global)
            newGlobal.x+=action.data.x/newGlobal.zoom;
            newGlobal.y+=action.data.y/newGlobal.zoom;
            return newGlobal;
        }        
        case actionTypes.MOVE_RESET: {
            const newGlobal = deepCopy(global)
            newGlobal.x=0;
            newGlobal.y=0;
            return newGlobal;
        }
        case actionTypes.MOVE_XY_WHEN_ZOOM:{
            const newGlobal = deepCopy(global)
            newGlobal.x=0;
            newGlobal.x=0;
            return newGlobal;
        }
        default:
            return global;
    }
};