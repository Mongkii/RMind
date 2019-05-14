import React, {useState, useEffect, Suspense, lazy} from 'react';
import {css} from 'emotion';
import {handlePropagation} from '../methods/assistFunctions';
import * as popupType from '../components/Popup/common/popupType';

const getContentComponent = type => {
    switch (type) {
        case popupType.NEW:
            return lazy(() => import('../components/Popup/subComponents/New'));
        case popupType.OPEN:
            return lazy(() => import('../components/Popup/subComponents/Open'));
        case popupType.EXPORT:
            return lazy(() => import('../components/Popup/subComponents/Export'));
        case popupType.THEME:
            return lazy(() => import('../components/Popup/subComponents/Theme'));
        default:
            return;
    }
};

const Popup = ({type, handleClosePopup, handleDownload}) => {
    //const [, ] = useState();
    const Content = getContentComponent(type);
    return (<div className={wrapper} onClick={handlePropagation}>
        <div className={content_wrapper}>
            <i className={'zwicon-close-circle ' + close_button} onClick={handleClosePopup} />
            <Suspense fallback={<></>}>
                <Content handleClosePopup={handleClosePopup} handleDownload={handleDownload} />
            </Suspense>
        </div>
        <div className={overlay} onClick={handleClosePopup}></div>
    </div>);
};

export default Popup;

// CSS
const wrapper = css`
position: fixed;
top:0;
bottom:0;
left:0;
right:0;
`;

const content_wrapper = css`
display: flex;
flex-direction: column;
position: absolute;
top:30%;
left:0;
right:0;
margin: auto;
padding: 40px 40px 20px;
width: 400px;
background-color: #ffffff;
border-radius: 20px;
z-index: 1;
font-size: 1rem;
`;

const close_button = css`
position: absolute;
top: 10px;
right: 10px;
font-size: 25px;
font-weight: 700;

&:active {
transform: scale(0.95)
}
`;

const overlay = css`
position: absolute;
top:0;
bottom:0;
left:0;
right:0;
background: #000000;
opacity: 0.2;
`;
