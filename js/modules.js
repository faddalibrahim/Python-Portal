const debounce = (func, wait, immediate) => {
    var timeout;
    return (...args) => {
        const later = () => {
            timeout = null;
            if(!immediate) func.apply(this,args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later,wait);
        if(callNow) func.apply(this,args);
    };
}

const $ = document.querySelector.bind(document),
      $$ = document.querySelectorAll.bind(document),
      $id = document.getElementById.bind(document),
      $cs = document.getElementsByClassName.bind(document);

export { $, $$, $id, $cs, debounce }