export default (zoomHook) => {
    const { zoomIn, zoomOut } = zoomHook;
    const getWheelDelta = (e) => {
        if (e.wheelDelta) {
            return e.wheelDelta
        } else {
            return -e.wheelDelta * 40
        }
    }

    const handleWhellEventWithkey = e => {

        if (e.ctrlKey === true && e.wheelDelta) {
            console.log('阻止默认鼠标滚轮，缩放mindmap', getWheelDelta(e))
            e.preventDefault()
            e.stopPropagation()
            getWheelDelta(e) > 0 ? zoomIn() : zoomOut()
        }
        if (e.altKey === true) {
            console.log('拖拽事件', getWheelDelta(e))
            e.preventDefault()
            e.stopPropagation()
        }


    };

    return event => {
        try {
            handleWhellEventWithkey(event); // 据说在 try 代码块中写大量语句会影响性能，因此包装为函数
        } catch (e) {
            alert('当前的节点信息存在问题，请重新选择节点');
        }
    };
};