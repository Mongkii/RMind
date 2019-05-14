import React, {useContext} from 'react';
import {context} from '../../../context';
import {setTitle} from '../../../context/reducer/global/actionCreator';
import useMindmap from '../../../customHooks/useMindmap';
import defaultMindmap from '../../../statics/defaultMindmap';
import * as refer from '../../../statics/refer';
import {ButtonSet, MainButton, Shortcut, Highlight, Annotation} from '../common/styledComponents';

const New = ({handleClosePopup, handleDownload}) => {
    const {global:{dispatch}} = useContext(context);
    const {setMindmap} = useMindmap();

    const handleNewFile = () => {
        setMindmap(defaultMindmap, true);
        dispatch(setTitle(refer.DEFAULT_TITLE));
        handleClosePopup();
    };

    return (<div>
        <Highlight>新建导图后，当前思维导图的数据将丢失。</Highlight>
        <Annotation>要保存当前数据，请将思维导图<Shortcut onClick={handleDownload}>下载至本地</Shortcut>。</Annotation>
        <ButtonSet>
            <MainButton onClick={handleNewFile}>新建导图</MainButton>
            <button onClick={handleClosePopup}>取消</button>
        </ButtonSet>
    </div>);
};

export default New;