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

let gameBoard = document.getElementById('game-board');
let restartButton = document.getElementById('restart-button');
let flippedCards = [];
let matchedPairs = 0;
let lastFlipped = [];
let timer = 0;
let timerInterval;
let moveCount = 0;
let memoryChallengeEnabled = false;


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    gameBoard.innerHTML = '';
    const shuffledSymbols = [...symbols];
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

        const id1 = `${card1.dataset.symbol}-${Math.floor([...gameBoard.children].indexOf(card1) / 8) + 1}-${([...gameBoard.children].indexOf(card1) % 8) + 1}`;
        const id2 = `${card2.dataset.symbol}-${Math.floor([...gameBoard.children].indexOf(card2) / 8) + 1}-${([...gameBoard.children].indexOf(card2) % 8) + 1}`;

        lastFlipped = lastFlipped.filter(entry => entry.id !== id1 && entry.id !== id2);
        renderTileHistory();

        if (matchedPairs === 32) {
            stopTimer(); // Stop the timer when the game is won
            setTimeout(() => alert('You win!'), 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.innerHTML = '';
        card2.innerHTML = '';
    }

    flippedCards = [];
}

function updateTileHistory(symbol, index) {
    const row = Math.floor(index / 8) + 1;
    const col = (index % 8) + 1;
    lastFlipped.unshift({
        symbol,
        position: `(${row}, ${col})`,
        id: `${symbol}-${row}-${col}`
    });

    if (lastFlipped.length > 5) lastFlipped.pop();
    renderTileHistory();
}


function renderTileHistory() {
    const historyDiv = document.getElementById('tile-history');
    historyDiv.innerHTML = lastFlipped
        .map(entry => `<span>${entry.symbol} ${entry.position}</span>`)
        .join('');
}


restartButton.addEventListener('click', () => {
    console.log('Restart button clicked'); // Debug log
    matchedPairs = 0;
    flippedCards = [];
    lastFlipped = [];
    stopTimer(); // also sets timerInterval = null
    timer = 0;
    document.getElementById('timer').textContent = timer;
    resetMoveCounter();
    renderTileHistory(); // Clear tile history display
    createBoard();
});

createBoard();
