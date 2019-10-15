import {useContext} from 'react';
import {context} from '../context';
import * as editPanelAction from '../context/reducer/editPanel/actionCreator';


const useEditPanel = () => {
    const {editPanel: {state:epState,dispatch: epDispatch}} = useContext(context);
    return {
        toggelPanelShow: (bool) => {
            if(epState.isShow===bool){
                return ;    
            }
            epDispatch(editPanelAction.toggelPanelShow(bool));
        },
        savePanel: (bool) => {
            epDispatch(editPanelAction.toggelPanelShow(bool));
        },
    }
};

export default useEditPanel;