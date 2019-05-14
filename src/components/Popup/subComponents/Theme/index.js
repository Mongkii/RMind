import React, {useEffect} from 'react';
import {css} from 'emotion';
import useTheme from '../../../../customHooks/useTheme';
import {ButtonSet, Highlight} from '../../common/styledComponents';
import ThemeListItem from './ThemeListItem';

const Theme = ({handleClosePopup}) => {
    const {theme_index, theme_list, setTheme} = useTheme();

    useEffect(() => {
        localStorage.setItem('theme_index', theme_index);
    }, [theme_index]);

    return (<div>
        <Highlight>请选择主题：</Highlight>
        <ul className={list_wrapper}>
            {theme_list.map((theme, index) => <ThemeListItem key={theme.main} theme={theme} index={index}
                                                             is_current={theme_index === index} setTheme={setTheme} />)}
        </ul>
        <ButtonSet>
            <button onClick={handleClosePopup}>完成</button>
        </ButtonSet>
    </div>);
};

export default Theme;

// CSS
const list_wrapper = css`
display: flex;
justify-content: space-between;
flex-wrap: wrap;
padding: 0;
list-style: none;
`;