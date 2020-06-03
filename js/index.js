import { $, $$, $id, $cs } from './modules.js';

let scoreBox = $id("scoreBox");
let optionBox = $id("optionBox");

scoreBox.querySelector("p").addEventListener("click", () => scoreBox.classList.remove("showScore"));
optionBox.querySelector("p").addEventListener("click", () => optionBox.classList.remove("showOptions"));



/*When user selects a quiz set or when he submits a quiz*/
let clickedChapter;
$id("screen-take-quiz").addEventListener("click", function(e) {
    let mainDiv = this;
    // let questionType = e.target;

    // console.log(e.target);

    // if(e.target.className === 'chapters'){
    //     optionBox.classList.add('showOptions');
    //     return;
    // }


    if(e.target.tagName === "P" && e.target.parentElement.className === 'chapters') {
        optionBox.classList.add('showOptions');
        optionBox.querySelector("span").textContent = e.target.textContent;
        clickedChapter = e.target.textContent.toLowerCase();
        console.log(clickedChapter);
    }

    else if(e.target.tagName === 'ARTICLE' && e.target.parentElement.parentElement.id === 'optionBox'){
        fetchQuiz(e,mainDiv,clickedChapter);
        // console.log(clickedChapter);
        // console.log(e.target.textContent.toLowerCase());
    }

    else if(e.target.textContent.toLowerCase() == "submit") 
        markQuiz()

});

//fetching quiz from quiz json file
const fetchQuiz = (e,mainDiv,clickedChapter) => {
    const clickedChapterr = clickedChapter,
          clickedQuestionType = e.target.textContent.toLowerCase().replace(/[^a-z0-9]/gi,'');


          // console.log(clickedChapterr);
          // console.log(clickedQuestionType);

          // return;
    
    (async() => {
        const response = await fetch("questions_file.json");
        const quizFile = await response.json();
        const {questionTypes} = await quizFile.find(quiz => quiz.chapter == clickedChapterr);

        console.log(questionTypes);
        console.log(clickedQuestionType);
        console.log(questionTypes[clickedQuestionType]);
        // return;

        renderQuiz(questionTypes[clickedQuestionType],mainDiv);
    })()

    $("#header nav span").textContent = clickedChapter;
}


//rendering selected quiz type to the screen
const renderQuiz = (selectedQuestionType,mainDiv) => {
    //clearing the take-quiz-screen to append quiz questions

    // console.log(selectedQuestionType);
    // return;


    mainDiv.innerHTML = null;

    //submit button
    const submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.textContent = "Submit";

    //A selected question type is an array of objects containing a question, its a correct answer and its options
    //I loop through each object and destructure it into q(question), ans(answer) and opts(options)
    selectedQuestionType.forEach((questionObject,index) => {

        const {q,ans,opts} = questionObject;

        const questionBlock = document.createElement("div");
        questionBlock.className ="questionBlock";

        const question = document.createElement("p");
        question.textContent = `${index+1}. ${q}`;

        questionBlock.appendChild(question)

        let optNum = 1
        for(let opt of opts){

            const input = document.createElement('input'),
                  label = document.createElement('label'),
                  br = document.createElement('br');

            //setting attributes for the radio button
            input.type = "radio";
            input.id = `q${index+1}-option-${optNum}`;
            input.name = `q${index+1}-option`;
            input.value = opt;

            //setting correct answer
            if(ans === opt) input.className = "correct";

            //attributes for the label
            label.textContent = opt;
            label.setAttribute('for', `q${index+1}-option-${optNum}`);

            questionBlock.appendChild(input);
            questionBlock.appendChild(label);
            questionBlock.appendChild(br);

            optNum++;
        }


        mainDiv.appendChild(questionBlock);
    })

    mainDiv.appendChild(submitButton);
}


const markQuiz = () => {
    let numberOfQuestions = $$(".questionBlock").length,
        radios = Array.from($$("#screen-take-quiz input[type=radio]")),
        checkedRadios = radios.filter(radio => radio.checked);


    if(checkedRadios.length !== numberOfQuestions){
        $("#screen-take-quiz").appendChild(scoreBox);
        scoreBox.classList.add("showScore");
        scoreBox.querySelector("article").textContent = `Answer all questions`;
    }else{
        //all correct answers are radios with a class of correct
        let allCorrectAnswers = radios.filter(radio => radio.className == "correct");
        allCorrectAnswers.forEach(correctAnswer => correctAnswer.nextElementSibling.classList.add("markCorrect"));

        //user correct answers are those checked radios that have a class of correct
        let userCorrectAnswers = checkedRadios.filter(checkedRadio => checkedRadio.className == "correct");

        //user score is the length of user correct answers
        let score = userCorrectAnswers.length;

        //user incorrect answers are the checked radios that have no class of correct
        let userIncorrectAnswers = checkedRadios.filter(checkedRadio => checkedRadio.className !== "correct");
        userIncorrectAnswers.forEach(incorrectAnswer => incorrectAnswer.nextElementSibling.classList.add("markWrong"));

        //disabling radios
        radios.forEach(radio => radio.disabled = true);

        displayUserScore(score,numberOfQuestions);
    }
}

const displayUserScore = (score,numberOfQuestions) => {
    $("#screen-take-quiz").appendChild(scoreBox);
    scoreBox.classList.add("showScore");
    scoreBox.querySelector("article").innerHTML = `You scored ${score} out of ${numberOfQuestions}`;
    let parent = document.createElement("div");

    //hide the submit button and display "retake quiz" and "exit"
    let submitButton = $("#screen-take-quiz button");
    submitButton.style.display = "none";


    let exitButton = document.createElement("div");
    // exitButton.textContent = "Exit";
    exitButton.innerHTML = `<i class='fas fa-times'></i>  Exit`;
    exitButton.style.cssText = "display: inline-block; width: 46%; text-align:center; ; margin-left: 0.5%";
    exitButton.addEventListener("click", () => location.reload());
    // $("#screen-take-quiz").appendChild(exitButton);
    // $("#screen-take-quiz").prepend(exitButton);
    parent.prepend(exitButton);


    let retakeQuizButton = document.createElement("div");
    // retakeQuizButton.textContent = "Retake Quiz"
    retakeQuizButton.innerHTML = `<i class='fas fa-redo'></i>  Redo`;
    retakeQuizButton.style.cssText = "display: inline-block; width: 46%; text-align:center; margin-right: 0.5%";
    // $("#screen-take-quiz").appendChild(retakeQuizButton);
    // $("#screen-take-quiz").prepend(retakeQuizButton);
    parent.prepend(retakeQuizButton);


    $("#screen-take-quiz").prepend(parent);

    retakeQuizButton.addEventListener("click", function(){
        //remove retake and exit buttons
        this.parentElement.parentElement.removeChild(parent);
        // this.parentElement.removeChild(retakeQuizButton);
        // exitButton.parentElement.removeChild(exitButton);

        //show submit button
        submitButton.style.display = "block";

         //remove colored backgrounds of correct and wrong answers
         document.querySelectorAll(".markCorrect,.markWrong").forEach(function(label){
            label.className = null;
            if(label.previousElementSibling.checked == true) label.previousElementSibling.checked = false;
         })

         //able radio buttons
         let radios = Array.from($$("#screen-take-quiz input[type=radio]"));
         radios.forEach(radio => radio.disabled = false);
    })
}