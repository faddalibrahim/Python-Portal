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

    if(e.target.tagName == "SMALL" && e.target.parentElement.className == "questionSet"){
        let clickedChapter = e.target.parentElement.previousElementSibling.textContent.toLowerCase();
        let clickedQuestionSet = e.target.textContent.toLowerCase();

        fetch("questions_file.json")
        .then(response => response.json())
        .then(quizFile => quizFile.find(quiz => quiz.chapter == clickedChapter))
        .then(({questionSet}) => renderQuiz(questionSet[clickedQuestionSet],mainDiv))
    }else if(e.target.textContent == "Submit"){
        markQuiz()
    }

});



const renderQuiz = (questionSetToDisplay,mainDiv) => {
    mainDiv.innerHTML = "";

    const submitSubmit = document.createElement("button");
    submitSubmit.type = "button";
    submitSubmit.textContent = "Submit";


    questionSetToDisplay.forEach((questionBlock,index) => {

        const {q,ans,opts} = questionBlock;

        const container = document.createElement("div");
        container.className ="questionBlock";

        const question = document.createElement("p");
        question.textContent = `${index+1}. ${q}`;


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

            if(ans.toString() === opt.toString()){
                input.className = "correct";
            }


            //attributes for the label
            label.textContent = opt.toString();
            // label.id = `option-${index+1}`;
            label.setAttribute('for', `q${index+1}-option-${optNum}`);

            container.appendChild(input);
            container.appendChild(label);
            container.appendChild(br);

            optNum++;
        }


        mainDiv.appendChild(container);
    })

    mainDiv.appendChild(submitSubmit);

}


const markQuiz = () => {
    let numberOfQuestions = document.querySelectorAll(".questionBlock").length;


    let radios = Array.from(document.querySelectorAll("#screen-take-quiz input[type=radio]"));

    let checkedRadios = radios.filter(radio => radio.checked);


    if(checkedRadios.length !== numberOfQuestions){
        alert("please answer all questions");
    }else{
        //all correct answers are radios with a class of correct
        //here i give all correct answers a background-color of green
        let allCorrectAnswers = radios.filter(radio => radio.className == "correct");
        allCorrectAnswers.forEach(allCorrectAnswer => allCorrectAnswer.nextElementSibling.classList.add("markCorrect"));

        //user correct answers are those checked radios that have a class of correct
        let userCorrectAnswers = checkedRadios.filter(checkedRadio => checkedRadio.className == "correct");


        //user score is the length of user correct answers
        let score = userCorrectAnswers.length;


        //user incorrect answers are the checked radios that have no class of correct
        //here i give the wring answers chosen by the user a background of red
        let userIncorrectAnswers = checkedRadios.filter(checkedRadio => checkedRadio.className !== "correct");
        userIncorrectAnswers.forEach(userIncorrectAnswer => userIncorrectAnswer.nextElementSibling.classList.add("markWrong"));


        displayUserScore(score,numberOfQuestions);
    }

}

const displayUserScore = (score,numberOfQuestions) => {
    alert(`you scored ${score} out of ${numberOfQuestions}`);

    //hide the submit button and display "retake quiz exit"

    let submitButton = document.querySelector("#screen-take-quiz button");

    submitButton.style.display = "none";


    let exitButton = document.createElement("div");
    exitButton.addEventListener("click", () => location.reload());
    exitButton.textContent = "Exit";
    document.querySelector("#screen-take-quiz").appendChild(exitButton);


    let retakeQuizButton = document.createElement("div");
    retakeQuizButton.textContent = "Retake Quiz"
    document.querySelector("#screen-take-quiz").appendChild(retakeQuizButton);

    retakeQuizButton.addEventListener("click", function(){
        //remove retake and exit buttons
        this.parentElement.removeChild(retakeQuizButton);
        exitButton.parentElement.removeChild(exitButton);

        //show submit button
        submitButton.style.display = "block";

         //remove colored backgrounds of correct and wrong answers
         // document.querySelectorAll(".markCorrect,.markWrong").forEach(option => option.className = "");
         document.querySelectorAll(".markCorrect,.markWrong").forEach(function(label){
            label.className = "";
            if(label.previousElementSibling.checked == true) label.previousElementSibling.checked = false;
         })

    })


}

const retakeQuiz = (retakeQuizButton,exitButton,submitButton) => {
   

  

   
}