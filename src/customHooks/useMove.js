import {useContext} from 'react';
import {context} from '../context';
import * as globalAction from '../context/reducer/global/actionCreator';


const useMove = () => {
    const {global: {dispatch: gDispatch}} = useContext(context);
    return {        
        moveXY: (x,y) => {
            gDispatch(globalAction.moveXY(x,y))
        },
        moveReset: () => {
            gDispatch(globalAction.moveReset())
        },
    }
};

export default useMove;