import React, {useEffect,useContext, useRef} from 'react';
import {css} from 'emotion';
import useTheme from '../customHooks/useTheme';

const Theme = ({handleClosePopup, handleDownload}) => {
    const {theme, theme_index, theme_list, setTest} = useTheme();
    const a = useRef();
    const b = useRef();
    const c = useRef();
    const d = useRef();
    const e = useRef();

    const handleChangeTheme = () => {

    };

    const handleTemp = () => {
        setTest([a.current.value,
            b.current.value,
            c.current.value,
            d.current.value,
            e.current.value]);
    };

    useEffect(()=>{
        localStorage.setItem('theme_index',theme_index);
    },[theme_index]);

    //const [, ] = useState();
    return (<div className={wrap}>
        <p>Main Light Dark Ex Assist</p>
        <input ref={a} onChange={handleTemp} value={theme.main} type="color" />
        <input ref={b} onChange={handleTemp} value={theme.light} type="color" />
        <input ref={c} onChange={handleTemp} value={theme.dark} type="color" />
        <input ref={d} onChange={handleTemp} value={theme.ex} type="color" />
        <input ref={e} onChange={handleTemp} value={theme.assist} type="color" />
        <div style={{marginTop: '30px'}}>
            <button onClick={() => {
                console.log({
                    main: a.current.value,
                    light: b.current.value,
                    dark: c.current.value,
                    ex: d.current.value,
                    assist: e.current.value
                })
            }}>导出
            </button>
            <button onClick={handleClosePopup}>取消</button>
        </div>
    </div>);
};

export default Theme;

// CSS
const wrap = css`
position: fixed;
right: 20px;
bottom: 20px;
font-size: 18px;
`;