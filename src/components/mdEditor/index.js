import React, { useState, useEffect } from 'react';

function MdEditor(props) {
    const { propText } = props;

    const [text, setText] = useState(propText);

    useEffect(() => {
        setText(propText)
    }, [propText]);
    
    const onChange = (e) => {
        setText(e.target.value)
    }

    const onBlur = () => {
        console.log('备注：', text)
        props.onBlur && props.onBlur(text)
    }



    return (
        <div className={props.className || ''}>
            <textarea style={textarea} onChange={onChange} onBlur={onBlur} value={text} />
        </div>
    )
}

export default MdEditor;


const textarea = {
    width: '100%',
    height: '100%',
    resize: 'none'
}