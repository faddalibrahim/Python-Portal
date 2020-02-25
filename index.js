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
    if(e.target.parentElement.className == "questionSet"){
        let clickedChapter = e.target.parentElement.previousElementSibling.textContent.toLowerCase();
        let clickedQuestionSet = e.target.textContent;

        // fetch("dumb.json")
        // .then(response => response.json())
        // // .then( quizFile => console.log(quizFile.find(quiz => quiz.chapter == clickedChapter)))
        // .then( quizFile => quizFile.find(quiz => quiz.chapter == clickedChapter))
        // .then(({questionSet}) => console.log(questionSet.TrueOrFalse))
        // .catch(err => console.log(err));

        fetch("dumb.json")
        .then(response => response.json())
        .then(quizFile => quizFile.find(quiz => quiz.chapter == clickedChapter))
        // .then(({questionSet}) => render(questionSet.clickedQuestionSet))
        .then(({questionSet}) => render(questionSet,clickedQuestionSet))

        // console.log(clickedQuestionSet)
    }
    // const mainContainer = document.querySelector('#screen-take-quiz');


    // fetch("dumb.json")
    // .then(response => response.json())
    // .then( ({chapter1}) =>render(chapter1, mainContainer))
    // .catch(err => console.log(err));


    // fetch("dumb.json")
    // .then(response => response.json())
    // .then( ({chapter1}) => console.log(chapter1))
    // .catch(err => console.log(err));

    // fetch("dumb.json")
    // .then(response => response.json())
    // .then( item => console.log(item))
    // .catch(err => console.log(err));

});


//this function renders the selected quiz to the screen
// const render = (chapter, mainDiv) => {

// }

const render = (questionSet,clickedQuestionSet) => {
    console.log(clickedQuestionSet)
}

// const render = (chapter, mainDiv) => {


//     const nodes = mainDiv.querySelectorAll('.chapter');
//     for (let node of nodes) {
//         mainDiv.removeChild(node);
//     }

//     chapter.questions.map( ({q, ans, options}, i) => {
//         const qN = i+1;
//     const container = document.createElement('div');
//     const question = document.createElement('p');

//     question.textContent = `${qN}. ${q}`;

//     container.appendChild(question);


//     for (let option of options) {
//         const input = document.createElement('input');
//         const label = document.createElement('label');


//         input.type = "radio";
//         input.id = `${qN}-${option}`;
//         input.name = `${qN}-option`;
//         input.value = option;

//         label.setAttribute('for', `${qN}-${option}`);
//         label.textContent = option.toString().toUpperCase();

       

//         container.appendChild(input);
//         container.appendChild(label);
//     }

//     mainDiv.appendChild(container);



//     })
    
// }