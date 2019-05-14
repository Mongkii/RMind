import React, {useState, useContext} from 'react';
import {css} from 'emotion';
import {context} from '../../context';
import useMindmap from '../../customHooks/useMindmap';
import useHistory from '../../customHooks/useHistory';
import * as refer from '../../statics/refer';
import * as popupType from '../../components/Popup/common/popupType';
import {handlePropagation, downloadFile} from '../../methods/assistFunctions'; // 防止 Mindmap 中的选中状态由于冒泡被清除
import ToolButton from '../../components/ToolButton';
import MindmapTitle from '../../components/MindmapTitle';
import Popup from '../../components/Popup';

const Nav = () => {
    const [popup, setPopup] = useState(popupType.NONE);
    const {mindmap: {state: mindmap}, history: {state: history}, global: {state: {title}}} = useContext(context);
    const {expandAll} = useMindmap();
    const {undoHistory, redoHistory} = useHistory();

    const handleClosePopup = () => {
        setPopup(popupType.NONE);
    };

    const handleNewFile = () => {
        setPopup(popupType.NEW);
    };

    const handleDownload = () => {
        const url = `data:text/plain,${encodeURIComponent(JSON.stringify(mindmap))}`;
        downloadFile(url, `${title}.rmf`);
    };

    const handleOpenFile = () => {
        setPopup(popupType.OPEN);
    };

    const handleExport = () => {
        setPopup(popupType.EXPORT);
    };

    const handleTheme = () => {
        setPopup(popupType.THEME);
    };

    const handleUndo = () => {
        undoHistory();
    };

    const handleRedo = () => {
        redoHistory();
    };

    const handleExpand = () => {
        expandAll(refer.ROOT_NODE_ID);
    };

    return (<nav className={wrapper}>
        <section className={section} onClick={handlePropagation}>
            <ToolButton icon={'add-item-alt'} onClick={handleNewFile}>新建</ToolButton>
            <ToolButton icon={'folder-open'} onClick={handleOpenFile}>打开</ToolButton>
            <ToolButton icon={'file-download'} onClick={handleDownload}>下载至本地</ToolButton>
            <ToolButton icon={'duplicate'} onClick={handleExport}>导出</ToolButton>
            <ToolButton icon={'palette'} onClick={handleTheme}>主题</ToolButton>
        </section>
        <section className={section}>
            <MindmapTitle />
        </section>
        <section className={section} onClick={handlePropagation}>
            <ToolButton icon={'undo'} disabled={history.undo.length === 0} onClick={handleUndo}>撤销</ToolButton>
            <ToolButton icon={'redo'} disabled={history.redo.length === 0} onClick={handleRedo}>重做</ToolButton>
            <ToolButton icon={'scale'} onClick={handleExpand}>展开所有节点</ToolButton>
        </section>
        {popup !== popupType.NONE &&
        <Popup type={popup} handleClosePopup={handleClosePopup} handleDownload={handleDownload} />}
    </nav>);
};

export default Nav;

// CSS
const wrapper = css`
display: flex;
justify-content: space-between;
position: fixed;
top:0;
left:0;
right:0;
height: 56px;
padding: 0 50px;
font-size: 25px;
background-color: #ffffff;
box-shadow: 0 0px 2px #aaaaaa;
z-index: 10;
`;

const section = css`
display: flex;
`;