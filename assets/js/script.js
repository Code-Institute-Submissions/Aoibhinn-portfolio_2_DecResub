const QUESTION = document.querySelector('#question');
const CHOICES = Array.from(document.querySelectorAll('.choice-text'));
const PROGRESS_TEXT = document.querySelector('#progressText');
const SCORE_TEXT = document.querySelector('#score');
const timeleft = document.getElementById("timeleft");


//Let
let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

//pulling questions from OPEN TRIVIA DATABASE api
fetch("https://opentdb.com/api.php?amount=5&category=18&difficulty=easy&type=multiple")
    .then(res => {
        return res.json();
    })

    //Load questions
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            //sets the question format
            const formattedQuestion = {
                question: loadedQuestion.question,
            };
            //sets the choice format
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );
            //sets incorrect answer format
            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })

const SCORE_POINTS = 10;
const MAX_QUESTIONS = 5;

//start game function
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    //adds and hides loader while questions load
    
};

//countdown timer for each question
timer = () => {
    // set timer decrease 1 every second
    time = time - 1;
    if (time < 30) {
        // display time left
        timeleft.innerHTML = `<i class="far fa-clock"></i> : ${time} seconds`;
    }
    if (time < 1) {
        // moves to next question when time is up
        clearInterval(update);
        getNewQuestion();
    }
};



getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        //saves score to local storage
        localStorage.setItem('mostRecentScore', score);
        //takes user to the end page
        return window.location.assign('end.html');
    }

    questionCounter++;
    PROGRESS_TEXT.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionsIndex];
    question.innerText = currentQuestion.question;

    CHOICES.forEach(choice => {
        const number = choice.dataset.number;
        choice.innerText = currentQuestion['choice' + number];
    });

    //Removes used questions
    availableQuestions.splice(questionsIndex, 1);
    // set timer of 30s for each question
    time = 30;
    update = setInterval("timer()", 1000);
    acceptingAnswers = true;
};

CHOICES.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        //applies css styling for right or wrong answers and displays correct answer
        if (selectedAnswer == currentQuestion.answer) {
            classToApply = "correct";
            incrementScore(SCORE_POINTS);
        } else {
            classToApply = "incorrect";
            alert(`Sorry the correct answer was ${currentQuestion.answer}!`, )
        }


        selectedChoice.parentElement.classList.add(classToApply);

        //adds slight delay before next question and removes css styling to answers
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
            clearInterval(update);
        }, 600);
    });
});

//Display added score to player 

incrementScore = num => {
    score += num;
    SCORE_TEXT.innerText = score;
};
