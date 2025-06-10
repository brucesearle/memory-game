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


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    gameBoard.innerHTML = '';
    shuffle(symbols);
    for (let i = 0; i < symbols.length; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbols[i];
        card.addEventListener('click', function () {
            flipCard.call(this, i);
        });
        gameBoard.appendChild(card);
    }
}

function flipCard(index) {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.innerHTML = this.dataset.symbol;
        flippedCards.push(this);
        updateTileHistory(this.dataset.symbol, index);
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs += 1;

        // Remove matched symbol from history
        lastFlipped = lastFlipped.filter(entry => entry.symbol !== card1.dataset.symbol);
        renderTileHistory();

        if (matchedPairs === 32) {
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
    lastFlipped.unshift({ symbol, position: `(${row}, ${col})` });

    // Keep only the last 5 unmatched
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
    matchedPairs = 0;
    flippedCards = [];
    createBoard();
});

createBoard();
