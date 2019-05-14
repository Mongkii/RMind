import {useContext, useMemo} from 'react';
import {context} from '../context';
import * as globalAction from '../context/reducer/global/actionCreator';

export default () => {
    const {global: {state: {theme_index, theme_list}, dispatch}} = useContext(context);
    const theme = useMemo(() => theme_list[theme_index], [theme_index]);
    const setTheme = index => {
        dispatch(globalAction.setTheme(index));
    };

    return {
        theme,
        theme_index,
        theme_list,
        setTheme
    }
}