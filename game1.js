document.addEventListener("DOMContentLoaded", () => {
    const symbols = ["★", "☀", "❤", "☂", "✿", "♫", "☃", "✈"];
    const cards = [...symbols, ...symbols]; // Duplicate symbols for matching pairs
    const board = document.getElementById("game-board");
    const timerDisplay = document.getElementById("timer");
    const highScoreDisplay = document.getElementById("high-score");

    let flippedCards = [];
    let matchedCards = [];
    let timer = 0;
    let timerInterval;
    let highScore = localStorage.getItem("highScore") || 0; // Load high score from localStorage

    // Display the high score
    highScoreDisplay.textContent = highScore;

    // Shuffle the cards
    function shuffleCards() {
        cards.sort(() => Math.random() - 0.5);
    }

    // Create the game board
    function createBoard() {
        board.innerHTML = ""; // Clear the board
        cards.forEach((symbol, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.index = index;
            card.textContent = symbol;
            card.addEventListener("click", flipCard);
            board.appendChild(card);
        });
    }

    // Start the timer
    function startTimer() {
        if (!timerInterval) {
            timerInterval = setInterval(() => {
                timer++;
                timerDisplay.textContent = timer;
            }, 1);
        }
    }

    // Flip card logic
    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
            this.classList.add("flipped");
            flippedCards.push(this);

            if (flippedCards.length === 1) {
                startTimer(); // Start the timer on the first flip
            }

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 10);
            }
        }
    }

    // Check for a match
    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.textContent === card2.textContent) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedCards.push(card1, card2);

            if (matchedCards.length === cards.length) {
                clearInterval(timerInterval); // Stop the timer
                updateHighScore(); // Update high score if applicable
                alert(`Congratulations! You've matched all the symbols in ${timer} seconds!`);
            }
        } else {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
        }

        flippedCards = [];
    }

    // Update high score
    function updateHighScore() {
        if (highScore === 0 || timer < highScore) {
            highScore = timer;
            localStorage.setItem("highScore", highScore); // Save high score to localStorage
            highScoreDisplay.textContent = highScore;
        }
    }

    // Reset game
    function resetGame() {
        clearInterval(timerInterval); // Stop the timer
        timerInterval = null;
        timer = 0;
        timerDisplay.textContent = timer;
        flippedCards = [];
        matchedCards = [];
        shuffleCards(); // Shuffle cards again
        createBoard(); // Recreate the game board
    }

    // Initialize the game
    shuffleCards();
    createBoard();

    // Add event listener for the reset button
    document.getElementById("reset-button").addEventListener("click", resetGame);
});