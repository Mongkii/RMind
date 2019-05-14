import React, {useContext} from 'react';
import {css} from 'emotion';
import {context} from '../../../context';
import {setTitle} from '../../../context/reducer/global/actionCreator';
import useMindmap from '../../../customHooks/useMindmap';
import {ROOT_NODE_ID} from '../../../statics/refer';
import mindmapParser from '../../../methods/mindmapParser';
import {ButtonSet, MainButton, Shortcut, Highlight, Annotation} from '../common/styledComponents';

const Open = ({handleClosePopup, handleDownload}) => {
    const {global: {dispatch}} = useContext(context);
    const {setMindmap} = useMindmap();

    const handleOpenFile = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.rmf,.km,.txt,.md';
        input.addEventListener('change', event => {
            const file = event.target.files[0],
                file_name = file.name;
            let dot_index = file_name.length - 1;
            while (dot_index > 0 && file_name[dot_index] !== '.') {
                dot_index--;
            }
            const format = file_name.slice(dot_index + 1).toUpperCase(),
                title = file_name.slice(0, dot_index);
            const file_reader = new FileReader();
            file_reader.onload = event => {
                const str = event.target.result;
                const mindmap = mindmapParser(str, format);
                if (mindmap && mindmap.id === ROOT_NODE_ID) {
                    setMindmap(mindmap, true);
                    dispatch(setTitle(title));
                    handleClosePopup();
                } else {
                    alert('不是有效的思维导图文件');
                }
            };
            file_reader.readAsText(file);
        });
        input.click();
    };

    return (<div>
        <Highlight>打开其他文件后，当前思维导图的数据将丢失。</Highlight>
        <Annotation>要保存当前数据，请将思维导图<Shortcut onClick={handleDownload}>下载至本地</Shortcut>。</Annotation>
        <p className={sub_title}>支持打开格式：</p>
        <ul className={list_wrapper}>
            <li>RMind（.rmf）</li>
            <li>百度脑图（.km）</li>
            <li>Markdown（.md）</li>
            <li>文本文件（.txt）</li>
        </ul>
        <ButtonSet>
            <MainButton onClick={handleOpenFile}>打开文件</MainButton>
            <button onClick={handleClosePopup}>取消</button>
        </ButtonSet>
    </div>);
};

export default Open;

// CSS
const sub_title = css`
margin: 20px 0 5px;
padding-bottom: 8px;
border-bottom: 1px solid #dddddd;
`;

const list_wrapper = css`
margin: 0;
padding: 0;
font-size: 90%;
list-style: circle inside;

li {
line-height: 2em;
}
`;