import {useContext} from 'react';
import {context} from '../context';
import * as globalAction from '../context/reducer/global/actionCreator';


const useZoom = () => {
    const {global: {dispatch: gDispatch}} = useContext(context);
    return {
        zoomIn: () => {
            gDispatch(globalAction.zoomIn())
        },
        zoomOut: () => {
            gDispatch(globalAction.zoomOut())
        },
        zoomReset: () => {
            gDispatch(globalAction.zoomReset())
        },
    }
};

export default useZoom;