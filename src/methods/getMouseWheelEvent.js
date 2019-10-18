const mousemoveInfo = {
    startX: 0,
    startY: 0,
}

export default (propHook, zoomRate) => {
    const { zoomIn, zoomOut, moveXY } = propHook;
    const getWheelDelta = (e) => {
        if (e.wheelDelta) {
            return e.wheelDelta
        } else {
            return -e.wheelDelta * 40
        }
    }

    const handleWhellEventWithkey = e => {

        if (e.ctrlKey === true && e.wheelDelta) {
            e.preventDefault()
            e.stopPropagation()
            // console.log('缩放坐标',e.clientX,e.clientY)
            getWheelDelta(e) > 0 ? zoomIn(e.clientX,e.clientY) : zoomOut(e.clientX,e.clientY)
            return;
        }

        if (e.buttons === 1 && e.type === 'mousedown') {
            mousemoveInfo.startX = e.clientX
            mousemoveInfo.startY = e.clientY
            return
        }

        if (e.buttons === 1) {
            e.stopPropagation()
            const { startX, startY } = mousemoveInfo;
            const movedX = (e.clientX - startX);
            const movedY = (e.clientY - startY);
            moveXY(movedX / 10, movedY / 10)
            mousemoveInfo.startX = e.clientX
            mousemoveInfo.startY = e.clientY
        }
    };

    return event => {
        try {
            handleWhellEventWithkey(event); // 据说在 try 代码块中写大量语句会影响性能，因此包装为函数
        } catch (e) {
            alert('移动或缩放功能异常',e);
        }
    };
};