import {useContext} from 'react';
import {context} from '../context';
import * as globalAction from '../context/reducer/global/actionCreator';


const useZoom = () => {
    const {global: {dispatch: gDispatch}} = useContext(context);
    return {
        zoomIn: (x,y) => {
            gDispatch(globalAction.zoomIn(x,y))          
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