import { useState, useEffect, useRef, useContext } from 'react';
// import { css } from 'emotion';
// import { context } from '../../context'

const useResize = () => {
    // const self = useRef();
    const [flag, setFlag] = useState(0);

    const handleWindowResize = () => {
        setFlag(Date.now());
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        }
    }, []);

    useEffect(() => {
        
    }, [flag]);

    return {flag};
};

export default useResize;
