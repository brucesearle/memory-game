const symbols = [
    '🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🍑', '🍍',
    '🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🍑', '🍍',
    '🍋', '🍊', '🍈', '🍏', '🥭', '🥥', '🥝', '🍅',
    '🍋', '🍊', '🍈', '🍏', '🥭', '🥥', '🥝', '🍅',
    '🍆', '🥑', '🥒', '🥬', '🥦', '🌽', '🥕', '🌶️',
    '🍆', '🥑', '🥒', '🥬', '🥦', '🌽', '🥕', '🌶️',
    '🍄', '🥜', '🌰', '🍯', '🥚', '🧀', '🥖', '🥨',
    '🍄', '🥜', '🌰', '🍯', '🥚', '🧀', '🥖', '🥨'
];

const difficultySelect = document.getElementById('difficulty');

let gridSize = 8; // default to hard
let gameBoard = document.getElementById('game-board');
let restartButton = document.getElementById('restart-button');
let flippedCards = [];
let matchedPairs = 0;
let lastFlipped = [];
let timer = 0;
let timerInterval;
let moveCount = 0;
let memoryChallengeEnabled = false;
let score = 0;

function resetScore() {
    score = 0;
    document.getElementById('score').textContent = score;
}

function updateScore(points) {
    score += points;
    if (score < 0) score = 0; // Prevent negative score
    document.getElementById('score').textContent = score;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    gameBoard.innerHTML = '';

    // Set grid size in CSS
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 100px)`;

    const totalCards = gridSize * gridSize;
    const pairsNeeded = totalCards / 2;
    const shuffledSymbols = [...symbols].slice(0, pairsNeeded * 2);
    shuffle(shuffledSymbols);

    for (let i = 0; i < shuffledSymbols.length; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = shuffledSymbols[i];

        if (memoryChallengeEnabled) {
            card.innerHTML = shuffledSymbols[i];
            card.classList.add('flipped');
        }

        card.addEventListener('click', function () {
            flipCard.call(this, i);
        });

        gameBoard.appendChild(card);
    }

    if (memoryChallengeEnabled) {
        setTimeout(() => {
            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                card.classList.remove('flipped');
                card.innerHTML = '';
            });
        }, 3000);
    }
}



function startTimer() {
    timer = 0;
    document.getElementById('timer').textContent = timer;
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = timer;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetMoveCounter() {
    moveCount = 0;
    console.log('resetMoveCounter called. moveCount =', moveCount); // Debug log
    document.getElementById('move-counter').textContent = moveCount;
}

function incrementMoveCounter() {
    moveCount++;
    console.log('Move made. moveCount =', moveCount); // Debug log
    document.getElementById('move-counter').textContent = moveCount;
}

function updateTileHistory(symbol, index) {
    const row = Math.floor(index / gridSize) + 1;
    const col = (index % gridSize) + 1;
    lastFlipped.unshift({
        symbol,
        position: `(${row}, ${col})`,
        id: `${symbol}-${row}-${col}`
    });

    if (lastFlipped.length > 5) lastFlipped.pop();
    renderTileHistory();
}

function flipCard(index) {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        if (matchedPairs === 0 && timer === 0 && !timerInterval) {
            startTimer(); // Start timer on first move
        }

        this.classList.add('flipped');
        this.innerHTML = this.dataset.symbol;
        flippedCards.push(this);
        updateTileHistory(this.dataset.symbol, index);

        if (flippedCards.length === 2) {
            incrementMoveCounter();
            setTimeout(checkMatch, 1000);
        }
    }
}


function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs += 1;
        updateScore(10); // ✅ Add points for a match

        const id1 = `${card1.dataset.symbol}-${Math.floor([...gameBoard.children].indexOf(card1) / gridSize) + 1}-${([...gameBoard.children].indexOf(card1) % gridSize) + 1}`;
        const id2 = `${card2.dataset.symbol}-${Math.floor([...gameBoard.children].indexOf(card2) / gridSize) + 1}-${([...gameBoard.children].indexOf(card2) % gridSize) + 1}`;

        lastFlipped = lastFlipped.filter(entry => entry.id !== id1 && entry.id !== id2);
        renderTileHistory();

        if (matchedPairs === (gridSize * gridSize) / 2) {
            stopTimer();
            setTimeout(() => alert('You win!'), 500);
        }
    } else {
        updateScore(-2); // ❌ Deduct points for a mismatch
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.innerHTML = '';
        card2.innerHTML = '';
    }

    flippedCards = [];
}

function renderTileHistory() {
    const historyDiv = document.getElementById('tile-history');
    historyDiv.innerHTML = lastFlipped
        .map(entry => `<span>${entry.symbol} ${entry.position}</span>`)
        .join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const memoryToggle = document.getElementById('memory-mode-toggle');
    const restartButton = document.getElementById('restart-button');

    memoryToggle.addEventListener('change', () => {
        memoryChallengeEnabled = memoryToggle.checked;
        console.log('Memory Challenge Mode:', memoryChallengeEnabled);
    });

   difficultySelect.addEventListener('change', () => {
        const value = difficultySelect.value;
        if (value === 'easy') gridSize = 4;
        else if (value === 'medium') gridSize = 6;
        else gridSize = 8;
    });

    restartButton.addEventListener('click', () => {
        console.log('Restart button clicked');
        matchedPairs = 0;
        flippedCards = [];
        lastFlipped = [];
        stopTimer();
        timer = 0;
        document.getElementById('timer').textContent = timer;
        resetScore();
        resetMoveCounter();
        renderTileHistory();
        createBoard();
    });

    createBoard(); // Initial board setup
});
