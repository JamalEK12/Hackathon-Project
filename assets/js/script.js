const tree = document.getElementById('tree-stage');
const rainSound = document.getElementById('rainSound'); // New sound reference
const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const questions = [
    { q: "Which tree is known for its white bark?", a: ["Birch", "Oak", "Maple"], correct: 0 },
    { q: "Which tree produces acorns?", a: ["Oak", "Pine", "Willow"], correct: 0 },
    { q: "Which tree is famous for syrup?", a: ["Maple", "Cedar", "Cherry"], correct: 0 },
    { q: "Which tree stays green all winter?", a: ["Pine", "Elm", "Ash"], correct: 0 },
    { q: "Which tree is often found near water?", a: ["Willow", "Baobab", "Cactus"], correct: 0 }
];

let currentStep = 0;
let score = 0; // NEW: Track score
let raindrops = [];

function loadQuestion() {
    const scoreDisplay = document.getElementById('score-display');
    const quizBox = document.getElementById('quiz-box');
    const victoryMsg = document.getElementById('victory-msg');

    if (currentStep >= questions.length) {
        quizBox.classList.add('hidden');
        victoryMsg.classList.remove('hidden');
        document.getElementById('final-score').innerText = `Total Points: ${score} / 5`;
        return;
    }

    // Refresh display
    scoreDisplay.innerText = `Points: ${score}`;
    scoreDisplay.style.color = "#a5d6f7"; 

    const data = questions[currentStep];
    document.getElementById('question').innerText = data.q;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    data.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'btn';
        btn.onclick = () => checkAnswer(i);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(index) {
    const scoreDisplay = document.getElementById('score-display');
    if (index === questions[currentStep].correct) {
        // --- CORRECT: Add 1 point and grow tree ---
        score += 1;
        scoreDisplay.innerText = `Points: ${score}`;
        scoreDisplay.style.color = "#4CAF50";

        const prevScale = 0.2 + currentStep * 0.4;
        currentStep++;
        const currScale = 0.2 + currentStep * 0.4;

        // 1. Trigger Sound and tree animation
        rainSound.currentTime = 0;
        rainSound.play().catch(e => console.log("Audio play blocked until user interact"));

        // 2. Trigger Growth Animation with CSS Variables
        tree.style.setProperty('--prev-scale', prevScale);
        tree.style.setProperty('--curr-scale', currScale);
        tree.classList.remove('animate-grow');
        void tree.offsetWidth; // Force reflow to restart animation
        tree.classList.add('animate-grow');

        // 3. Visual Raindrop Effect
        triggerRain();

        setTimeout(() => {
            rainSound.pause();
            loadQuestion();
        }, 2500);
    } else {
        // --- WRONG: Subtract 1 point instantly ---
        if (score > 0) { 
            score -= 1; 
        }
        
        // Force the text to update and flash red immediately
        scoreDisplay.innerText = `Points: ${score}`;
        scoreDisplay.style.color = "#ff5252";
        void scoreDisplay.offsetWidth; // Force UI repaint

        shakeTree();

         // Reset color after a brief moment
        setTimeout(() => {
            scoreDisplay.style.color = "#a5d6f7";
        }, 500);
    }
}

function shakeTree() {
    // Uses CSS Transform to simulate a struggle
    tree.style.transform += " rotate(10deg)";
    setTimeout(() => {
        tree.style.transform = tree.style.transform.replace(" rotate(10deg)", "");
    }, 100);
}

function triggerRain() {
    raindrops = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: -20,
        s: Math.random() * 5 + 2
    }));

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#a5d6f7"; // Lighter blue for rain
        raindrops.forEach(d => {
            ctx.fillRect(d.x, d.y, 2, 10);
            d.y += d.s;
        });
        if (raindrops.some(d => d.y < canvas.height)) {
            requestAnimationFrame(animate);
        }
    };
    animate();
}
// NEW: Reset Function
function resetGame() {
    currentStep = 0;
    score = 0;
    tree.style.setProperty('--curr-scale', 0.2);
    tree.style.transform = "scale(0.2)";
    tree.classList.remove('animate-grow');

    document.getElementById('victory-msg').classList.add('hidden');
    document.getElementById('quiz-box').classList.remove('hidden');
    loadQuestion();
}

// NEW: Event Listener for Restart
document.getElementById('restart-btn').onclick = resetGame;

// Start the game
loadQuestion();