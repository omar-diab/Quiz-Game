// Select Elements
let countSpan = document.querySelector('.count span');
let bullets = document.querySelector('.bullets')
let BulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let checkButton = document.querySelector('.check');
let resulets = document.querySelector('.resultes');
let countDownElement = document.querySelector('.count-down')

// Set Logices
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

// [1] Get Info from Json 
function getQuestions() {
    let myRequuest = new XMLHttpRequest();
    myRequuest.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let questionObject = JSON.parse(this.responseText);
            let questionCount = questionObject.length;
            // Continue to [2] Create Bullets + Questions Count
            createBullets(questionCount);
            // Continue to [3] Add Questions Data
            addQuestionsData(questionObject[0] , questionCount);
            // Continue to [5] CountDown 
                countDown(15 , questionCount);
            // [4] Click On Check
            checkButton.onclick = () => {
                // Get Right Answer
                let rightAnswer = questionObject[currentIndex].right_answer;
                // Increase Index 
                currentIndex++;
                // Check the answer
                checkAnswer(rightAnswer, questionCount);
                // Remove Previous Question
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';
                // Add Question Data
                addQuestionsData(questionObject[currentIndex] , questionCount);
                // Handle Bullets class
                handleBulletsClass();
                // Continue to [5] CountDown 
                clearInterval(countDownInterval);
                countDown(15 , questionCount);
                // Show Results
                showResults(questionCount);
            }
        }   
    }
    myRequuest.open("Get", "question.json" , true);
    myRequuest.send();
}
getQuestions();

// [2] Make Bullets And Know How Many Questions We Have
function createBullets(num) {
    countSpan.innerHTML = num;
    // Create Spans
    for(let i = 0; i < num; i++) {
        // Create Span
        let theBullet = document.createElement('span');
        // Make the first Span has on class
        if(i === 0) {
            theBullet.className = 'on';
        }
        // Append Span to Spans
        BulletsSpanContainer.appendChild(theBullet);
    }
}

// [3] Get Questions Data
function addQuestionsData(obj , count) {
    if(currentIndex < count) {
        // Create H3 Question
        let questionTitle = document.createElement('h3');
        // Create Question Text
        let questionText = document.createTextNode(obj.title);
        // Append text to H3
        questionTitle.appendChild(questionText);
        // Append h3 to quizArea
        quizArea.appendChild(questionTitle);
        // Create the Answers
        for(let i = 1; i <= 4; i++) {
            // Create main answer div
            let mainDiv = document.createElement('div');
            // Add Class to main div
            mainDiv.className = 'answer';
            // Create radio input
            let redioInput = document.createElement('input');
            // Add type + name + id
            redioInput.name = 'question';
            redioInput.type = 'radio';
            redioInput.id = `answer_${i}`;
            redioInput.dataset.answer = obj[`answer_${i}`];
            // Make first answer checked
            if(i === 1) {
                redioInput.checked = true;
            }
            // Create Lable
            let theLable = document.createElement('label');
            // Add for Attribute
            theLable.htmlFor = `answer_${i}`;
            // Create lable text
            let lableText = document.createTextNode(obj[`answer_${i}`]);
            // Add the text to lable
            theLable.appendChild(lableText);
            // Add Input + Lable to main div
            mainDiv.appendChild(redioInput);
            mainDiv.appendChild(theLable);
            // Add the main div to answers-area
            answersArea.appendChild(mainDiv);
        }
    }
}

// Continue to [4] 1
function checkAnswer(rAnswer , count) {
    let answers = document.getElementsByName('question');
    let theChoosenAnswer;
    for(let i = 0; i < answers.length; i++) {
        if(answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}
// Continue to [4] 2
function handleBulletsClass() {
    let bulletsSpans = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpan = Array.from(bulletsSpans);
    arrayOfSpan.forEach((span , index) => {
        if(currentIndex === index) {
            span.classList = 'on';
        }
    })
}
// Continue to [4] 3
function showResults(count) {
    let theResulets;
    if(currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        checkButton.remove();
        bullets.remove();
        if(rightAnswers > (count / 2) && rightAnswers < count) {
            theResulets = `<span class= "very-good">Very Good</span> You Got ${rightAnswers} From ${count}`;
        }else if(rightAnswers === count) {
            theResulets = `<span class= "perfect">Perfect</span> You Got All The Correct Answers`;
        }else {
            theResulets = `<span class= "good">Good</span> You Got ${rightAnswers} From ${count}`;
        }
        resulets.innerHTML = theResulets;
        resulets.style.padding = '15px';
        resulets.style.backgroundColor = 'White';
        resulets.style.marginTop = '10px';
        // Redirect after 3 seconds
        setTimeout(function() {
            window.location.href = "index.html";
        }, 5000);
    }
}

// [5] Create CountDown Function
function countDown(duration , count) {
    if(currentIndex < count) {
        let m , s;
        countDownInterval = setInterval(function() {
            m = parseInt(duration / 60);
            s = parseInt(duration % 60);
            m = m < 10 ? `0${m}`: m;
            s = s < 10 ? `0${s}`: s;
            countDownElement.innerHTML = `${m} : ${s}`;
            if(--duration < 0) {
                clearInterval(countDownInterval);
                checkButton.click();
            }
        }, 1000) 
    }
}