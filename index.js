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

const screens_parent = document.getElementById("screens-parent"),
      // links = document.querySelectorAll("nav a"),
      links = Array.from(document.getElementsByTagName("a")),
      screens = document.getElementsByClassName("screens");

const pageTransition = debounce(() => {
    const index = Math.round(screens_parent.scrollLeft / window.innerWidth);
    // console.log(index)

    links.forEach(link => {
        if(link.classList.contains("clicked")){
            link.classList.remove("clicked");
            // console.log(link);
        }
    })

    links[index].classList.add("clicked");
},60)

screens_parent.addEventListener("scroll",pageTransition);



document.querySelector("#screen-take-quiz").addEventListener("click", e => {
    if(e.target.className == "chapter"){
        filename = e.target.textContent.toLowerCase().split(" ").join("-")+".html";

        // alert(filename);

        let http = new XMLHttpRequest();
        http.onreadystatechange = function () {
            if(http.readyState == 4 && http.status == 200){
                if(this.response !== ""){
                    document.querySelector("#screen-take-quiz").innerHTML = this.responseText;
                }
            }
        }
        http.open("GET", `quiz-files/${filename}`, true);
        http.send();
    }
})