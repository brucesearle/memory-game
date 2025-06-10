
const symbols = [
    '🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍',
    '🥝', '🍅', '🥥', '🥭', '🍈', '🍋', '🍊', '🍏',
    '🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍',
    '🥝', '🍅', '🥥', '🥭', '🍈', '🍋', '🍊', '🍏',
    '🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍',
    '🥝', '🍅', '🥥', '🥭', '🍈', '🍋', '🍊', '🍏',
    '🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍',
    '🥝', '🍅', '🥥', '🥭', '🍈', '🍋', '🍊', '🍏'
];

let shuffledSymbols = shuffle(symbols);
let flippedCards = [];
let matchedPairs = 0;

const gameBoard = document.getElementById('game-board');

shuffledSymbols.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.textContent = this.dataset.symbol;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 1000);
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs++;
        if (matchedPairs === symbols.length / 2) {
            setTimeout(() => alert('You win!'), 500);
        }
    } else {
        card1.classList.remove('flipped');
        card1.textContent = '';
        card2.classList.remove('flipped');
        card2.textContent = '';
    }

    flippedCards = [];
}
