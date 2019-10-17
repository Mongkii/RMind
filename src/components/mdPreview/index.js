import React, { useState, useEffect } from 'react';
import marked from 'marked';
import './index.css'

import hljs from 'highlight.js'
import 'highlight.js/styles/github.css';

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    },
    pedantic: false,
    gfm: false,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
});

function MdPreview(props) {
    const { mdtext='' } = props;

    //   const [example, setExample] = useState('initialValue');
    //   useEffect(() => {
    //     // 使用浏览器的 API 更新页面标题
    //     // document.title = `You clicked count times`;
    //   });
    useEffect(() => {        
        document.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightBlock(block);
        });      
      },[mdtext]);

    return (
        <div className="MdPreview">
            <i className="zwicon-note" style={{ fontSize: 20 }}></i>

            <div className="MdPreview-Content" dangerouslySetInnerHTML={{ __html: marked(mdtext) }} />
        </div>
    )
}

export default MdPreview;