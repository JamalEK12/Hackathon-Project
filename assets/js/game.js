/**
 * THE STATE OBJECT
 * Holds the current "status" of our game in one place.
 */
const gameState = {
    score: 0,
    currentQuestionIndex: 0,
    totalQuestions: quizQuestions.length,
};

/**
 * THE UI OBJECT 
 * Keep track of the elements that will be manipulated.
 */
const ui = {
    // Text Elements
    questionText: document.getElementById("question"),
    answerElements: document.querySelectorAll(".answer"),
    scoreDisplay: document.getElementById("score"),
    questionTracker: document.getElementById("track-question-number"),
    
    // Progress Bar
    progressBar: document.querySelector(".progress-bar"),
    
    // Buttons
    buttons: [
        document.getElementById("btnA"),
        document.getElementById("btnB"),
        document.getElementById("btnC"),
        document.getElementById("btnD")
    ],
    
    // Modal Elements
    modal: new bootstrap.Modal(document.getElementById("game-modal")),
    finalScore: document.getElementById("final-score"),
    replayBtn: document.getElementById("replay-button")
};

/**
 * START THE GAME
 */
function init() {
    gameState.score = 0;
    gameState.currentQuestionIndex = 0;
    
    // Initialize visuals
    renderCurrentQuestion();
}

/**
 * UPDATE THE SCREEN
 * This function looks at the 'gameState' and updates the HTML to match.
 */

function renderCurrentQuestion() {
    const currentData = quizQuestions[gameState.currentQuestionIndex];
    const displayNum = gameState.currentQuestionIndex + 1;

    // 1. Update the Question Heading
    ui.questionText.innerText = `${currentData.question} of ${gameState.totalQuestions}`;

    // 2. Update the <li> answer text (A: Answer 1, etc.)
    ui.answerElements.forEach((li, index) => {
        li.innerText = `${currentData.choices[index]}`;
    });

    // 4. Update the Progress Bar
    // Calculate percentage: ((current-1) / total) * 100
    const progressPercent = ((displayNum - 1 )/ gameState.totalQuestions) * 100;
    ui.progressBar.style.width = `${progressPercent}%`;
    ui.progressBar.setAttribute("aria-valuenow", displayNum);
}

/**
 * CHECK THE ANSWER
 * @param {number} selectedIndex - The index (0-3) of the button clicked.
 */
function handleButtonClick(selectedIndex) {
}

/**
 * GAME OVER
 */
function showGameOver() {
}

/**
 * EVENT LISTENERS
 * This is where we tell the buttons what to do when clicked.
 */

// Loop through the button array [btnA, btnB, btnC, btnD]
ui.buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        handleButtonClick(index);
    });
});

// Run the initialization
init();