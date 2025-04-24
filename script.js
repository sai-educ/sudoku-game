// --- Global State Variables ---
let difficulty = null; // 'easy', 'medium', 'hard', 'godzilla'
let puzzleBoard = []; // 9x9 array, 0 for empty, generated puzzle
let solutionBoard = []; // 9x9 array, the complete solution
let userBoard = []; // 9x9 array, reflects user's inputs
let selectedCell = null; // { element: DOM_Element, row: number, col: number }
let wrongAttempts = 0;
const MAX_ATTEMPTS = 3;
let gameState = 'difficultySelection'; // 'playing', 'gameOver', 'won'

// --- DOM Elements ---
let difficultyScreen, gameScreen, gridElement, numberPadElement, attemptsDisplay, messageArea, restartButton, difficultyDisplay;

// --- Initialization ---
window.onload = function() {
    // Get DOM elements
    difficultyScreen = document.getElementById('difficulty-screen');
    gameScreen = document.getElementById('game-screen');
    gridElement = document.getElementById('sudoku-grid');
    numberPadElement = document.getElementById('number-pad');
    attemptsDisplay = document.getElementById('attempts-display');
    messageArea = document.getElementById('message-area');
    restartButton = document.getElementById('restart-btn');
    difficultyDisplay = document.getElementById('difficulty-display');

    // Add event listeners
    difficultyScreen.addEventListener('click', handleDifficultySelection);
    numberPadElement.addEventListener('click', handleNumberPadClick);
    gridElement.addEventListener('click', handleCellClick); // Event delegation
    restartButton.addEventListener('click', handleRestartClick);

    // Initial setup
    showScreen('difficultySelection');
    renderNumberPad(); // Create number pad buttons
};

// --- Screen Management ---
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenName}-screen`).classList.add('active');
}

// --- Event Handlers ---
function handleDifficultySelection(event) {
    if (event.target.tagName === 'BUTTON' && event.target.dataset.difficulty) {
        difficulty = event.target.dataset.difficulty;
        print(`Difficulty selected: ${difficulty}`); // Use print for OpenProcessing console
        difficultyDisplay.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1); // Show difficulty
        gameState = 'playing';
        generateAndStartGame();
        showScreen('game');
    }
}

function handleNumberPadClick(event) {
    if (gameState !== 'playing') return;
    if (event.target.tagName === 'BUTTON' && event.target.dataset.number) {
        const number = parseInt(event.target.dataset.number, 10);
        if (selectedCell && !selectedCell.element.classList.contains('pre-filled')) {
            placeNumber(selectedCell.row, selectedCell.col, number);
        }
    }
}

function handleCellClick(event) {
    if (gameState !== 'playing') return;
    const target = event.target;
    if (target.classList.contains('grid-cell') && !target.classList.contains('pre-filled')) {
        // Deselect previous cell
        if (selectedCell) {
            selectedCell.element.classList.remove('selected');
        }
        // Select new cell
        target.classList.add('selected');
        selectedCell = {
            element: target,
            row: parseInt(target.dataset.row, 10),
            col: parseInt(target.dataset.col, 10)
        };
    } else {
         // Deselect if clicking outside valid cells
        if (selectedCell) {
            selectedCell.element.classList.remove('selected');
            selectedCell = null;
        }
    }
}

function handleRestartClick() {
    print("Restarting game...");
    // Clear state variables
    difficulty = null;
    puzzleBoard = [];
    solutionBoard = [];
    userBoard = [];
    selectedCell = null;
    wrongAttempts = 0;
    gameState = 'difficultySelection';

    // Reset UI
    gridElement.innerHTML = ''; // Clear grid
    messageArea.textContent = '';
    messageArea.className = 'message-area'; // Reset message style
    updateAttemptsDisplay();
    showScreen('difficultySelection');
}

// --- Game Setup & Rendering ---
function generateAndStartGame() {
    print("Generating Sudoku board...");
    // ** Placeholder for actual Sudoku generation **
    // For now, we'll use a very simple pre-filled board and solution
    // TODO: Replace with real generation logic
    solutionBoard = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    // Create puzzle by removing some numbers (simple version)
    puzzleBoard = createPuzzleSimple(solutionBoard, difficulty);

    // Initialize user board state
    userBoard = puzzleBoard.map(row => [...row]); // Deep copy

    // Render the initial board state
    renderBoard();
    wrongAttempts = 0; // Reset attempts
    updateAttemptsDisplay();
    messageArea.textContent = ''; // Clear any previous messages
    selectedCell = null; // Deselect any cell
}

// Simple puzzle creation (removes numbers, doesn't guarantee difficulty/uniqueness)
function createPuzzleSimple(fullSolution, level) {
    let puzzle = fullSolution.map(row => [...row]); // Deep copy
    let cellsToRemove = 0;
    switch (level) {
        case 'easy': cellsToRemove = 35; break;
        case 'medium': cellsToRemove = 45; break;
        case 'hard': cellsToRemove = 52; break;
        case 'godzilla': cellsToRemove = 60; break; // Very hard
        default: cellsToRemove = 40;
    }

    let removed = 0;
    while (removed < cellsToRemove) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            removed++;
        }
        // Safety break for potential infinite loops on extreme difficulties
        if (removed > 81) break;
    }
    return puzzle;
}

// Renders the Sudoku grid onto the page
function renderBoard() {
    gridElement.innerHTML = ''; // Clear previous grid
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.row = r; // Store row/col for later retrieval
            cell.dataset.col = c;

            const value = userBoard[r][c]; // Display user's board state

            if (puzzleBoard[r][c] !== 0) { // Check original puzzle for pre-filled
                cell.textContent = value;
                cell.classList.add('pre-filled');
            } else {
                // User-fillable cell
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('user-filled');
                     // Optional: check if this already known user value is incorrect
                     if (value !== solutionBoard[r][c]) {
                        // cell.classList.add('incorrect'); // Style immediately? Or only on check? Let's wait.
                     }
                } else {
                    cell.textContent = ''; // Empty cell
                }
                // Add thick borders for 3x3 blocks (handled by CSS now)
            }
            gridElement.appendChild(cell);
        }
    }
}

// Renders the number pad buttons
function renderNumberPad() {
    numberPadElement.innerHTML = ''; // Clear previous buttons
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.dataset.number = i;
        numberPadElement.appendChild(button);
    }
    // Add an erase button maybe?
    // const eraseButton = document.createElement('button');
    // eraseButton.textContent = 'X';
    // eraseButton.dataset.number = '0'; // Or handle differently
    // numberPadElement.appendChild(eraseButton);
}

// --- Game Logic ---
function placeNumber(row, col, num) {
    // Update the user's board state
    userBoard[row][col] = num;

    // Update the cell display
    selectedCell.element.textContent = num;
    selectedCell.element.classList.add('user-filled');

    // Validate the input
    validateInput(row, col, num);

    // Check if the game is won
    if (gameState === 'playing' && checkWinCondition()) {
        endGame(true); // Player won
    }
}

function validateInput(row, col, num) {
    if (num !== solutionBoard[row][col]) {
        wrongAttempts++;
        updateAttemptsDisplay();
        print(`Wrong attempt! ${wrongAttempts}/${MAX_ATTEMPTS}`);

        // Optional: Visual feedback for wrong move
        selectedCell.element.classList.add('incorrect'); // Temporarily add class
        setTimeout(() => {
           if(selectedCell && selectedCell.element) { // Check if still selected
               selectedCell.element.classList.remove('incorrect');
           }
           // If they entered the wrong number, maybe clear it? Or leave it? Leave it for now.
           // userBoard[row][col] = 0; // Optionally clear wrong number
           // selectedCell.element.textContent = '';
           // selectedCell.element.classList.remove('user-filled');

        }, 500); // Remove red after 0.5 seconds

        if (wrongAttempts >= MAX_ATTEMPTS) {
            endGame(false); // Player lost
        }
    } else {
        print("Correct!");
        // Correct number placed, remove incorrect styling if it was there
        selectedCell.element.classList.remove('incorrect');
    }
}

function checkWinCondition() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (userBoard[r][c] === 0 || userBoard[r][c] !== solutionBoard[r][c]) {
                return false; // Found empty or incorrect cell
            }
        }
    }
    return true; // All cells filled correctly
}

function endGame(isWin) {
    gameState = isWin ? 'won' : 'gameOver';
    messageArea.textContent = isWin ? "Congratulations! You solved it!" : `Game Over! (${MAX_ATTEMPTS} wrong attempts)`;
    messageArea.className = isWin ? 'message-area win' : 'message-area lose';

    // Disable further interaction
    if (selectedCell) {
        selectedCell.element.classList.remove('selected');
        selectedCell = null;
    }
    // Optionally reveal solution or highlight all errors
    revealErrors();
}

function revealErrors() {
    const cells = gridElement.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        if (!cell.classList.contains('pre-filled')) {
             const r = parseInt(cell.dataset.row, 10);
             const c = parseInt(cell.dataset.col, 10);
             if (userBoard[r][c] !== 0 && userBoard[r][c] !== solutionBoard[r][c]) {
                 cell.classList.add('incorrect'); // Highlight final errors
             } else if (userBoard[r][c] === 0) {
                 // Optionally show missing numbers from solution
                 // cell.textContent = solutionBoard[r][c];
                 // cell.style.color = 'lightgrey';
             }
        }
    });
}


function updateAttemptsDisplay() {
    attemptsDisplay.textContent = wrongAttempts;
}

// --- Placeholder for actual Sudoku Generation/Solver ---
// NOTE: Implementing these correctly is complex.
// This simple generator just pokes holes randomly.
function generateSudokuSolution() {
    print("WARNING: Using placeholder solution board.");
    // In a real app, use a backtracking algorithm here.
    return [
        [5, 3, 4, 6, 7, 8, 9, 1, 2], [6, 7, 2, 1, 9, 5, 3, 4, 8], [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3], [4, 2, 6, 8, 5, 3, 7, 9, 1], [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4], [2, 8, 7, 4, 1, 9, 6, 3, 5], [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
}

// --- Utility for p5.js print/console.log consistency ---
function print(msg) {
    console.log(msg);
}