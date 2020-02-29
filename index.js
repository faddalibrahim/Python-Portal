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



document.querySelector("#screen-take-quiz").addEventListener("click", function(e) {
    mainDiv = this;

    if(e.target.parentElement.className == "questionSet"){
        let clickedChapter = e.target.parentElement.previousElementSibling.textContent.toLowerCase();
        let clickedQuestionSet = e.target.textContent.toLowerCase();

        fetch("questions_file.json")
        .then(response => response.json())
        .then(quizFile => quizFile.find(quiz => quiz.chapter == clickedChapter))
        .then(({questionSet}) => render(questionSet[clickedQuestionSet],mainDiv))
    }

});


//this function renders the selected quiz to the screen
// const render = (chapter, mainDiv) => {

// }

const render = (questionSetToDisplay,mainDiv) => {
    mainDiv.innerHTML = "";

    questionSetToDisplay.forEach((questionBlock,index) => {
        const {q,ans,opts} = questionBlock;

        const container = document.createElement("div");
        container.className ="questionBlock";

        const question = document.createElement("p");
        question.textContent = q;

        //appending question to div
        container.appendChild(question)

        optNum = 1
        for(opt of opts){

            const input = document.createElement('input');
            const label = document.createElement('label');
            const br = document.createElement('br');

            //setting attributes for the radio button
            input.type = "radio";
            input.id = `q${index+1}-option-${optNum}`;
            input.name = `q${index+1}-option`;
            input.value = opt;


            //attributes for the label
            label.textContent = opt.toString();
            // label.id = `option-${index+1}`;
            label.setAttribute('for', `q${index+1}-option-${optNum}`);

            container.appendChild(input);
            container.appendChild(label);
            container.appendChild(br);

            optNum++
        }

        mainDiv.appendChild(container);
    })

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