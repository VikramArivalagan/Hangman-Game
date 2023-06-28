// Selecting necessary elements
const keyboard = document.querySelector(".keyboard");
const wordDisplay = document.querySelector(".word-display");
const hintElement = document.querySelector(".hint-text span");
const guessesElement = document.querySelector(".incorrect-guesses span");
const gameCharacterImg = document.querySelector(".container .game-character");
const popup = document.querySelector(".popup");
const playAgainBtn = popup.querySelector("button");

// Variables to track game state
let currentWord = null;
let maxGuess = 6;
let currentGuess = 0;
let correctLetters = [];

// Function to reset the game
const resetGame = () => {
  // Resetting game state
  currentGuess = 0;
  correctLetters = [];

  // Resetting UI elements
  popup.classList.remove("show");
  guessesElement.textContent = `${currentGuess} / ${maxGuess}`;
  gameCharacterImg.src = `images/injured-img-${currentGuess}.png`;
  wordDisplay.innerHTML = currentWord
    .split("")
    .map(() => `<li class="letter"></li>`)
    .join("");
  keyboard.querySelectorAll("button").forEach(btn => (btn.disabled = false));
};

// Function to select a random word
const getRandomWord = () => {
  // Selecting a random word from the wordList
  const {word, hint} = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = word;
  hintElement.innerText = hint;
  resetGame(); // Resetting the game and UI for a new word
};

// Function to handle game over
const gameOver = isVictory => {
  const popupHeading = isVictory ? "You Won the Game!" : "You Lost the Game!";
  const popupText = isVictory ? `The word was '${currentWord}'.` : `The correct word was '${currentWord}'.`;
  const popupImgSrc = isVictory ? `images/victory.gif` : `images/lost.gif`;

  // Updating popup content
  popup.classList.add("show");
  popup.querySelector("img").src = popupImgSrc;
  popup.querySelector("h4").textContent = popupHeading;
  popup.querySelector("p").textContent = popupText;
};

// Function to handle game initialization and user input
const initGame = e => {
  const userLetter = e.target.dataset.letter.toLowerCase();
  if (!correctLetters.includes(userLetter)) {
    if (currentWord.includes(userLetter)) {
      // Handling correct letter guess
      for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] == userLetter) {
          correctLetters += userLetter;
          wordDisplay.querySelectorAll("li")[i].innerText = userLetter.toUpperCase();
          wordDisplay.querySelectorAll("li")[i].classList.add("guessed");
        }
      }
    } else {
      // Handling incorrect letter guess
      currentGuess++;
      gameCharacterImg.src = `images/injured-img-${currentGuess}.png`;
    }
    e.target.disabled = true;
    guessesElement.innerText = `${currentGuess} / ${maxGuess}`;
  }

  // Checking game status
  if (currentGuess === maxGuess) {
    return gameOver(false);
  } else if (correctLetters.length === currentWord.length) {
    return gameOver(true);
  }
};

// Creating keyboard buttons and adding event listeners
for (let i = 65; i <= 90; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  button.setAttribute("data-letter", String.fromCharCode(i));
  keyboard.appendChild(button);
  button.addEventListener("click", initGame);
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
