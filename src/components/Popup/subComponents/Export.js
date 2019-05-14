import React, {useContext} from 'react';
import {css} from 'emotion';
import {context} from '../../../context';
import useMindmap from '../../../customHooks/useMindmap';
import * as refer from '../../../statics/refer';
import html2canvas from 'html2canvas';
import {downloadFile} from '../../../methods/assistFunctions';
import mindmapExporter from '../../../methods/mindmapExporter';
import {Highlight, ButtonSet} from '../common/styledComponents';

const Export = ({handleClosePopup}) => {
    const {mindmap: {state: mindmap}, global: {state: {title}}} = useContext(context);
    const {clearNodeStatus} = useMindmap();

    const handleExportPNG = () => {
        clearNodeStatus(); // 防止选中状态时的工具条等也被导出到图像
        html2canvas(document.getElementById(refer.MINDMAP_ID)).then(canvas => {
            let url = canvas.toDataURL('image/png');
            downloadFile(url, `${title}.png`);
        });
    };

    const handleExportText = format => {
        const data = mindmapExporter(mindmap, format);
        let url = `data:text/plain,${encodeURIComponent(data)}`;
        downloadFile(url, `${title}.${format.toLowerCase()}`);
    };

    return (<div>
        <Highlight>请选择导出格式：</Highlight>
        <ul className={list_wrapper}>
            <li onClick={handleExportPNG}><i className={'zwicon-file-image'} />PNG 图片（.png）</li>
            <li onClick={() => { handleExportText('KM'); }}><i className={'zwicon-file-pdf'} />百度脑图（.km）</li>
            <li onClick={() => { handleExportText('MD'); }}><i className={'zwicon-file-table'} />Markdown（.md）</li>
            <li onClick={() => { handleExportText('TXT'); }}><i className={'zwicon-file-font'} />文本文件（.txt）</li>
        </ul>
        <ButtonSet>
            <button onClick={handleClosePopup}>完成</button>
        </ButtonSet>
    </div>);
};

export default Export;

// CSS
const list_wrapper = css`
padding: 0;
list-style: none;

li {
padding: 5px 0 5px 5px;
border-left: 3px solid transparent;
border-bottom: 1px solid #dddddd;
line-height: 30px;
cursor: pointer;
}

li:last-of-type {
border-bottom: none;
}

li:hover {
border-left: 3px solid var(${refer.THEME_EX});
}

li i {
margin-right: 10px;
font-size: 30px;
}
`;