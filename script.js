// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const difficultyScreen = document.getElementById('difficulty-screen');
    const gameScreen = document.getElementById('game-screen');

    // Buttons
    const difficultyButtons = difficultyScreen.querySelectorAll('button');
    const restartButton = document.getElementById('restart-btn');
    const numberPadContainer = document.getElementById('number-pad'); // Container for number buttons

    // Displays
    const gridContainer = document.getElementById('sudoku-grid');
    const difficultyDisplay = document.getElementById('difficulty-display');
    const attemptsInfo = document.getElementById('attempts-info'); // Changed ID
    const messageArea = document.getElementById('message-area');

    // Game State Variables
    let currentDifficulty = '';
    // let lives = 0; // REMOVED lives variable
    let puzzleBoard = []; // The initial puzzle state (0 for empty)
    let solutionBoard = []; // The fully solved board
    let workingBoard = []; // The board with user inputs
    let selectedCell = null; // Reference to the currently selected grid cell div

    // --- Screen Management ---

    function showScreen(screenToShow) {
        difficultyScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        screenToShow.classList.add('active');
    }

    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentDifficulty = button.dataset.difficulty;
            startGame(currentDifficulty);
        });
    });

    restartButton.addEventListener('click', () => {
        showScreen(difficultyScreen);
        gridContainer.innerHTML = '';
        numberPadContainer.innerHTML = '';
        messageArea.textContent = '';
        messageArea.className = '';
    });

    // --- Game Setup ---

    function startGame(difficulty) {
        difficultyDisplay.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        attemptsInfo.textContent = 'Unlimited'; // Set text for unlimited attempts
        messageArea.textContent = '';
        messageArea.className = '';
        selectedCell = null;

        // **IMPORTANT: Placeholder for actual Sudoku generation logic**
        const { puzzle, solution } = generateSudokuPuzzle(difficulty);
        puzzleBoard = puzzle;
        solutionBoard = solution;
        workingBoard = puzzle.map(row => [...row]);

        generateGrid();
        generateNumberPad();
        showScreen(gameScreen);
    }

    // **Placeholder Function - Needs Implementation**
    function generateSudokuPuzzle(difficulty) {
        // (Keep your existing generation logic here)
        console.warn(`generateSudokuPuzzle(${difficulty}) needs implementation! Using static puzzle.`);
        const easyPuzzle = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
        const easySolution = [
            [5, 3, 4, 6, 7, 8, 9, 1, 2], [6, 7, 2, 1, 9, 5, 3, 4, 8], [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3], [4, 2, 6, 8, 5, 3, 7, 9, 1], [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4], [2, 8, 7, 4, 1, 9, 6, 3, 5], [3, 4, 5, 2, 8, 6, 1, 7, 9]
        ];
        return { puzzle: easyPuzzle, solution: easySolution };
    }

    function generateGrid() {
        gridContainer.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                const value = puzzleBoard[r][c];
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('pre-filled');
                } else {
                    cell.addEventListener('click', handleCellClick);
                }
                // CSS should handle borders primarily now
                gridContainer.appendChild(cell);
            }
        }
    }

    function generateNumberPad() {
        numberPadContainer.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', handleNumberClick);
            numberPadContainer.appendChild(button);
        }
        const eraseButton = document.createElement('button');
        eraseButton.textContent = 'X';
        eraseButton.addEventListener('click', handleEraseClick);
        numberPadContainer.appendChild(eraseButton);
    }

    // --- Interaction Handling ---

    function handleCellClick(event) {
        const clickedCell = event.target;
        if (clickedCell.classList.contains('pre-filled')) return;

        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = clickedCell;
        selectedCell.classList.add('selected');
    }

    function handleNumberClick(event) {
        if (!selectedCell) return; // No cell selected

        const number = parseInt(event.target.textContent);
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        // Clear any previous incorrect flash first
        selectedCell.classList.remove('temp-incorrect');

        if (isValidMove(row, col, number)) {
            // --- Correct Number ---
            workingBoard[row][col] = number; // Update internal board
            selectedCell.textContent = number;
            selectedCell.classList.add('user-filled');
            selectedCell.classList.remove('incorrect'); // Should not be needed now

            if (checkWin()) {
                messageArea.textContent = "Congratulations! You solved it!";
                messageArea.classList.add('win');
                if (selectedCell) selectedCell.classList.remove('selected');
                selectedCell = null;
                // Optionally disable number pad or grid interactions
            }
        } else {
            // --- Incorrect Number ---
            // 1. Flash the cell visually
            selectedCell.classList.add('temp-incorrect');
            // Provide haptic feedback if available/desired
            // if (navigator.vibrate) { navigator.vibrate(100); }

            // 2. Remove the flash effect after a short delay
            setTimeout(() => {
                // Check if the cell still exists and has the class before removing
                if (selectedCell && selectedCell.classList.contains('temp-incorrect')) {
                    selectedCell.classList.remove('temp-incorrect');
                }
            }, 500); // Duration of the flash in milliseconds

            // 3. Crucially: Do NOT update the workingBoard or the cell's text content
            // The incorrect number doesn't "stick"
        }

        // Optional: Deselect cell after every number attempt?
        // if (selectedCell) selectedCell.classList.remove('selected');
        // selectedCell = null;
    }

    function handleEraseClick() {
        if (!selectedCell || selectedCell.classList.contains('pre-filled')) return;

        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        workingBoard[row][col] = 0;
        selectedCell.textContent = '';
        selectedCell.classList.remove('user-filled', 'incorrect', 'temp-incorrect'); // Clear all states
    }

    // --- Validation & Win Check (Placeholders/Example) ---

    function isValidMove(row, col, num) {
        // Check against the known solutionBoard for correctness
        console.log(`Checking if ${num} is valid at (${row}, ${col}). Solution is ${solutionBoard[row][col]}`);
        return solutionBoard[row][col] === num;
    }

    function checkWin() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (workingBoard[r][c] === 0 || workingBoard[r][c] !== solutionBoard[r][c]) {
                    return false;
                }
            }
        }
        return true;
    }

    // --- Initial State ---
    showScreen(difficultyScreen);

}); // End DOMContentLoaded