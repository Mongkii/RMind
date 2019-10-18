import {useContext} from 'react';
import {context} from '../context';
import * as globalAction from '../context/reducer/global/actionCreator';


const useZoom = () => {
    const {global: {dispatch: gDispatch}} = useContext(context);
    return {
        zoomIn: (x,y) => {
            gDispatch(globalAction.zoomIn(x,y))          
            // const centerX=document.querySelector('#rmind_main').offsetHeight
            // const centerY=document.querySelector('#rmind_main').offsetWidth  
            // const rate=(centerX-x)/(centerY-y)
            // x=x>centerX?10:-10;
            // y=y>centerY?10:-10    
            // console.log(x,y,centerX,centerY)
            // gDispatch(globalAction.moveXYWhenZoom(x,y))          
        },
        zoomOut: (x,y) => {
            gDispatch(globalAction.zoomOut(x,y))
        },
        zoomReset: () => {
            gDispatch(globalAction.zoomReset())
        },
    }
};

export default useZoom;