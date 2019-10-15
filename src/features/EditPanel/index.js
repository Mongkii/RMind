import React, {useContext, useState, useEffect} from 'react';
import {css} from 'emotion';
import useEditPanel from '../../customHooks/useEditPanel';
import useMindmap from '../../customHooks/useMindmap';
import {context} from '../../context'
import MdEditor from '../../components/mdEditor';

const EditPanel = () => {
    // const self = useRef();
    
    const {editPanel: {state:epState},nodeStatus:{state:nState}} =useContext(context)
    const {cur_node_info:{info='',text,id}}=nState
    
    const mindmapHook=useMindmap()
    const editPanleHook=useEditPanel();

    // const [inputVal,setInputVal]=useState(info)


    // const onChange=(e)=>{
    //     setInputVal(e.target.value);
    // }

    useEffect(()=>{
        // setInputVal(info)
        // console.log('当前节点信息',nState)
    },[info])

    
    if(!epState.isShow){
        return null;
    }
    
    return (        
        <div className={show} onClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()}>
            当前编辑节点：{text || '无'}        

            <i className="zwicon-close" style={close} onClick={()=>editPanleHook.toggelPanelShow(false)}></i>                        
            <MdEditor 
                className={mdEditor} 
                propText={info}
                onBlur={(value)=> id && mindmapHook.editNodeInfo(id,value)}
            />                       
            {/* <Button type="primary" onClick={()=>mindmapHook.editNodeInfo(id,inputVal)}>保存</Button>
            <Button type="primary" onClick={()=>editPanleHook.toggelPanelShow(false)}>关闭</Button> */}            
        </div>
    );
};

export default EditPanel;

// CSS
const show = css`
height: 500px;
width: 300px;
top: 20px;
right: 40px;
margin: 56px 0 0;
overflow: auto;
position: fixed;
//z-index: 10;
border: 2px solid #eeee;
border-radius: 10px;
background: #fff;
background:rgba(255,255,255,1);
box-shadow:0px 2px 12px 0px rgba(0,0,0,0.16);
padding:20px 10px;
`;

const close={    
    fontSize:20,
    position: 'absolute',
    cursor:'pointer',
    right: '10px',
    top: '5px',
}

const mdEditor=css`
    margin-top:20px;
    width:295px;
    height:460px;
`