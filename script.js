// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed"); // Log 1: Confirm script starts after DOM load

    // Screens
    const difficultyScreen = document.getElementById('difficulty-screen');
    const gameScreen = document.getElementById('game-screen');
    console.log("Screen elements:", { difficultyScreen, gameScreen }); // Log 2: Check if elements are found

    // Buttons
    const difficultyButtons = difficultyScreen.querySelectorAll('button');
    const restartButton = document.getElementById('restart-btn');
    const numberPadContainer = document.getElementById('number-pad');
    console.log("Buttons:", { difficultyButtons, restartButton }); // Log 3: Check button selections

    // Displays
    const gridContainer = document.getElementById('sudoku-grid');
    const difficultyDisplay = document.getElementById('difficulty-display');
    const attemptsInfo = document.getElementById('attempts-info');
    const messageArea = document.getElementById('message-area');

    // Game State Variables
    let currentDifficulty = '';
    let puzzleBoard = [];
    let solutionBoard = [];
    let workingBoard = [];
    let selectedCell = null;

    // --- Screen Management ---

    function showScreen(screenToShow) {
        console.log(`Attempting to show screen: ${screenToShow.id}`); // Log 7: Check showScreen call
        try {
            if (difficultyScreen) difficultyScreen.classList.remove('active');
            if (gameScreen) gameScreen.classList.remove('active');
            if (screenToShow) screenToShow.classList.add('active');
            console.log(`Screen ${screenToShow.id} should now be active.`); // Log 8: Confirm class added
             // Check final state
             console.log(`difficultyScreen active: ${difficultyScreen?.classList.contains('active')}`);
             console.log(`gameScreen active: ${gameScreen?.classList.contains('active')}`);
        } catch (error) {
            console.error("Error in showScreen:", error); // Log error during screen change
        }
    }

    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`Difficulty button "${button.dataset.difficulty}" clicked.`); // Log 4: Confirm button click listener
            currentDifficulty = button.dataset.difficulty;
            // Reset message area from previous game before starting new one
            if (messageArea) messageArea.textContent = '';
             if (messageArea) messageArea.className = '';
            startGame(currentDifficulty);
        });
    });

    if (restartButton) {
        restartButton.addEventListener('click', () => {
            console.log("Restart button clicked.");
            showScreen(difficultyScreen);
            if (gridContainer) gridContainer.innerHTML = '';
            if (numberPadContainer) numberPadContainer.innerHTML = '';
            if (messageArea) messageArea.textContent = '';
            if (messageArea) messageArea.className = '';
        });
    } else {
        console.error("Restart button not found!");
    }


    // --- Game Setup ---

    function startGame(difficulty) {
        console.log(`startGame called with difficulty: ${difficulty}`); // Log 5: Confirm startGame begins
        try {
            if (difficultyDisplay) difficultyDisplay.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
            if (attemptsInfo) attemptsInfo.textContent = 'Unlimited';
            selectedCell = null;

            // **IMPORTANT: Placeholder for actual Sudoku generation logic**
            const { puzzle, solution } = generateSudokuPuzzle(difficulty);
            puzzleBoard = puzzle;
            solutionBoard = solution;
            workingBoard = puzzle.map(row => [...row]); // Deep copy

            generateGrid();
            generateNumberPad();

            console.log("Game setup complete, attempting to show game screen."); // Log 6: Confirm setup done
            showScreen(gameScreen);

        } catch (error) {
            console.error(`Error during startGame(${difficulty}):`, error); // Log any error during setup
             // Show difficulty screen again if game setup fails
             showScreen(difficultyScreen);
             if(messageArea) messageArea.textContent = "Failed to start game. Check console.";
        }
    }

    // **Placeholder Function - Needs Implementation**
    function generateSudokuPuzzle(difficulty) {
        console.log(`Generating puzzle for difficulty: ${difficulty}`);
        // (Keep your existing generation logic here)
        // Ensure this function *always* returns an object with puzzle and solution arrays
         if (!difficulty) {
              console.error("generateSudokuPuzzle called without difficulty!");
              // Return a default empty/error state or throw error
              // Returning a basic valid structure to prevent downstream errors
               return {
                   puzzle: Array(9).fill(0).map(() => Array(9).fill(0)),
                   solution: Array(9).fill(0).map(() => Array(9).fill(0))
               };
         }
        // Using the static example for now
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
        // Add more logic here based on actual 'difficulty' parameter
        return { puzzle: easyPuzzle, solution: easySolution };
    }

    function generateGrid() {
        console.log("Generating grid...");
        if (!gridContainer) {
             console.error("Cannot generate grid: gridContainer not found.");
             return;
        }
        gridContainer.innerHTML = ''; // Clear previous grid
        if (!puzzleBoard || puzzleBoard.length !== 9) {
             console.error("Cannot generate grid: puzzleBoard is invalid.");
             return; // Avoid errors if puzzleBoard is not ready
        }
        for (let r = 0; r < 9; r++) {
            if (!puzzleBoard[r] || puzzleBoard[r].length !== 9) {
                 console.error(`Cannot generate grid: puzzleBoard row ${r} is invalid.`);
                 continue; // Skip invalid row
            }
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                const value = puzzleBoard[r][c];
                if (value !== 0 && value >= 1 && value <=9) { // Basic validation
                    cell.textContent = value;
                    cell.classList.add('pre-filled');
                } else {
                    // Ensure value is 0 if invalid
                    puzzleBoard[r][c] = 0; // Correct potential bad data in puzzle
                    cell.addEventListener('click', handleCellClick);
                }
                gridContainer.appendChild(cell);
            }
        }
        console.log("Grid generation complete.");
    }

    function generateNumberPad() {
        console.log("Generating number pad...");
        if (!numberPadContainer) {
             console.error("Cannot generate number pad: numberPadContainer not found.");
             return;
        }
        numberPadContainer.innerHTML = ''; // Clear previous pad
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
        console.log("Number pad generation complete.");
    }

    // --- Interaction Handling ---

    function handleCellClick(event) {
         console.log("Cell clicked:", event.target.dataset.row, event.target.dataset.col);
        const clickedCell = event.target;
        // Ensure it's actually a grid cell and not pre-filled
        if (!clickedCell.classList.contains('grid-cell') || clickedCell.classList.contains('pre-filled')) return;

        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        selectedCell = clickedCell;
        selectedCell.classList.add('selected');
         console.log("Cell selected:", selectedCell);
    }

    function handleNumberClick(event) {
        const clickedButton = event.target;
        console.log(`Number button ${clickedButton.textContent} clicked.`);
        if (!selectedCell) {
             console.log("No cell selected, number ignored.");
             return; // No cell selected
        }

        const number = parseInt(clickedButton.textContent);
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        // Ensure coordinates are valid
        if (isNaN(row) || isNaN(col)) {
            console.error("Selected cell has invalid row/col data.");
            return;
        }

        // Clear previous incorrect flash first
        selectedCell.classList.remove('temp-incorrect');

        if (isValidMove(row, col, number)) {
            console.log(`Number ${number} is CORRECT for cell (${row}, ${col}).`);
            workingBoard[row][col] = number;
            selectedCell.textContent = number;
            selectedCell.classList.add('user-filled');
            selectedCell.classList.remove('incorrect'); // Should not be needed

            if (checkWin()) {
                console.log("Game Won!");
                if (messageArea) {
                     messageArea.textContent = "Congratulations! You solved it!";
                     messageArea.classList.add('win');
                }
                if (selectedCell) selectedCell.classList.remove('selected');
                selectedCell = null;
            }
        } else {
            console.log(`Number ${number} is INCORRECT for cell (${row}, ${col}). Flashing cell.`);
            selectedCell.classList.add('temp-incorrect');
            // if (navigator.vibrate) { navigator.vibrate(100); } // Optional vibration

            setTimeout(() => {
                if (selectedCell && selectedCell.classList.contains('temp-incorrect')) {
                    selectedCell.classList.remove('temp-incorrect');
                     console.log("Incorrect flash removed.");
                }
            }, 500);
        }
    }

    function handleEraseClick() {
        console.log("Erase button clicked.");
        if (!selectedCell || selectedCell.classList.contains('pre-filled')) {
             console.log("Cannot erase: No cell selected or cell is pre-filled.");
             return;
        }

        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

         if (isNaN(row) || isNaN(col)) {
             console.error("Selected cell has invalid row/col data for erase.");
             return;
         }

        console.log(`Erasing cell (${row}, ${col}).`);
        workingBoard[row][col] = 0;
        selectedCell.textContent = '';
        selectedCell.classList.remove('user-filled', 'incorrect', 'temp-incorrect');
    }

    // --- Validation & Win Check (Placeholders/Example) ---

    function isValidMove(row, col, num) {
        // Simple check against the solution for now
         if (!solutionBoard || !solutionBoard[row] || typeof solutionBoard[row][col] === 'undefined') {
              console.error(`isValidMove check failed: Solution board invalid at (${row}, ${col})`);
              return false; // Prevent errors
         }
        const expected = solutionBoard[row][col];
        console.log(`Checking move: Cell (${row},${col}), Num: ${num}, Expected: ${expected}`);
        return expected === num;
    }

    function checkWin() {
         if (!workingBoard || workingBoard.length !== 9 || !solutionBoard || solutionBoard.length !== 9) {
             console.error("checkWin failed: Boards are invalid.");
             return false;
         }
        for (let r = 0; r < 9; r++) {
             if (workingBoard[r].length !== 9 || solutionBoard[r].length !== 9) {
                 console.error(`checkWin failed: Row ${r} has invalid length.`);
                 return false; // Invalid board structure
             }
            for (let c = 0; c < 9; c++) {
                if (workingBoard[r][c] === 0 || workingBoard[r][c] !== solutionBoard[r][c]) {
                    // console.log(`Win check fail at (${r}, ${c}): working=${workingBoard[r][c]}, solution=${solutionBoard[r][c]}`);
                    return false; // Board not full or doesn't match solution
                }
            }
        }
        console.log("Win check passed!");
        return true; // Board is full and matches solution
    }

    // --- Initial State ---
     console.log("Setting initial screen to difficulty screen.");
    // Ensure elements exist before trying to show screen
    if(difficultyScreen && gameScreen) {
         showScreen(difficultyScreen); // Start on the difficulty selection
    } else {
         console.error("Could not set initial screen: Difficulty or Game screen element not found!");
         // Display an error message to the user if possible
         document.body.innerHTML = "<h1>Error: Could not initialize game components. Check console.</h1>";
    }


}); // End DOMContentLoaded