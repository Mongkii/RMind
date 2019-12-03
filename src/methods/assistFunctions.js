export const handlePropagation = event => {
    event.stopPropagation();
};

export const deepCopy = input => { // 简单的递归深拷贝，只考虑 context 中 state 的复制，因此没有处理 function 等
    if (input instanceof Object) {
        if (Array.isArray(input)) {
            return input.map(deepCopy);
        }
        let output = {};
        Object.entries(input).forEach(([key, value]) => {
            output[key] = deepCopy(value);
        });
        return output;
    }
    return input;
};

export const findNode = (node, search_id) => {
    if (node.id === search_id) {
        return node;
    }
    return node.children.map(child => findNode(child, search_id)).find(item => item);
};

export const setShowChildrenTrue = node => {
    node.showChildren = true;
    node.children.forEach(setShowChildrenTrue);
};

export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
};

export const debounce=(func,wait)=>{
    let timer=null;
    return function(){
      if(timer) clearTimeout(timer);
      timer=setTimeout(()=>{
        // 绑定this的目的是，使得func的this指针保持普通,调用时候的指向
        // argument也为调用debounce过后的func传入的参数
        func.apply(this,arguments);
      },wait)
    }
  
  }