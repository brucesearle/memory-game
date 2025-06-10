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
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    }
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.innerHTML = this.dataset.symbol;
        updateTileHistory(this.dataset.symbol);
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    let [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs += 1;
        if (matchedPairs === symbols.length / 2) {
            setTimeout(() => alert('You win!'), 500);
        }
    } else {
        card1.classList.remove('flipped');
        card1.innerHTML = '';
        card2.classList.remove('flipped');
        card2.innerHTML = '';
    }
    flippedCards = [];
}

function updateTileHistory(symbol) {
    lastFlipped.unshift(symbol); // Add to the beginning
    if (lastFlipped.length > 5) lastFlipped.pop(); // Keep only 5

    const historyDiv = document.getElementById('tile-history');
    historyDiv.innerHTML = lastFlipped.map(sym => `<span>${sym}</span>`).join('');
}

restartButton.addEventListener('click', () => {
    matchedPairs = 0;
    flippedCards = [];
    createBoard();
});

createBoard();
