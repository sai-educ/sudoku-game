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
    const attemptsDisplay = document.getElementById('attempts-display');
    const messageArea = document.getElementById('message-area');

    // Game State Variables
    let currentDifficulty = '';
    let lives = 0;
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
        // Optionally clear grid/state immediately or wait until new game starts
        gridContainer.innerHTML = '';
        numberPadContainer.innerHTML = '';
        messageArea.textContent = '';
        messageArea.className = ''; // Reset message style
    });

    // --- Game Setup ---

    function startGame(difficulty) {
        difficultyDisplay.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1); // Capitalize
        lives = 3; // Example: Set lives
        attemptsDisplay.textContent = `0 / ${lives}`;
        messageArea.textContent = '';
        messageArea.className = ''; // Reset message style
        selectedCell = null;

        // **IMPORTANT: Placeholder for actual Sudoku generation logic**
        // This function needs to create a puzzle and its solution based on difficulty
        const { puzzle, solution } = generateSudokuPuzzle(difficulty);
        puzzleBoard = puzzle;
        solutionBoard = solution;
        // Deep copy the puzzle to start the working board
        workingBoard = puzzle.map(row => [...row]);

        generateGrid();
        generateNumberPad();
        showScreen(gameScreen);
    }

    // **Placeholder Function - Needs Implementation**
    function generateSudokuPuzzle(difficulty) {
        // This is where your Sudoku generation algorithm goes.
        // It should return an object like:
        // {
        //   puzzle: [ [5,3,0, ...], [6,0,0, ...], ... ], // 9x9 array, 0 for empty
        //   solution: [ [5,3,4, ...], [6,7,2, ...], ... ] // 9x9 array, complete solution
        // }
        console.warn(`generateSudokuPuzzle(${difficulty}) needs implementation!`);
        // Example static puzzle for testing:
        const easyPuzzle = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
         const easySolution = [
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
        return { puzzle: easyPuzzle, solution: easySolution };
    }

    function generateGrid() {
        gridContainer.innerHTML = ''; // Clear previous grid
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = r; // Store row/col for later reference
                cell.dataset.col = c;

                const value = puzzleBoard[r][c];
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('pre-filled');
                } else {
                    // Add click listener only to empty cells
                    cell.addEventListener('click', handleCellClick);
                }

                // Add thicker border classes (adjust logic if CSS handles it fully)
                 if ((c + 1) % 3 === 0 && c !== 8) cell.style.borderRight = "2px solid #333";
                 if ((r + 1) % 3 === 0 && r !== 8) cell.style.borderBottom = "2px solid #333";
                 // Your CSS might already handle this using nth-child selectors more effectively

                gridContainer.appendChild(cell);
            }
        }
    }

    function generateNumberPad() {
        numberPadContainer.innerHTML = ''; // Clear previous pad
        for (let i = 1; i <= 9; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', handleNumberClick);
            numberPadContainer.appendChild(button);
        }
        // Add Erase button (optional)
        const eraseButton = document.createElement('button');
        eraseButton.textContent = 'X'; // Or use an icon/word
        eraseButton.addEventListener('click', handleEraseClick);
        numberPadContainer.appendChild(eraseButton);
    }

    // --- Interaction Handling ---

    function handleCellClick(event) {
        const clickedCell = event.target;

        // Ignore clicks on non-empty cells (should only be on empty ones due to listener placement)
        if (clickedCell.classList.contains('pre-filled')) return;

        // Deselect previous cell
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }

        // Select new cell
        selectedCell = clickedCell;
        selectedCell.classList.add('selected');
    }

    function handleNumberClick(event) {
        if (!selectedCell) return; // Do nothing if no cell is selected

        const number = parseInt(event.target.textContent);
        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        // **IMPORTANT: Placeholder for validation logic**
        if (isValidMove(row, col, number)) {
            workingBoard[row][col] = number; // Update internal board
            selectedCell.textContent = number;
            selectedCell.classList.add('user-filled');
            selectedCell.classList.remove('incorrect'); // Remove incorrect if previously marked

            // **IMPORTANT: Placeholder for win check**
            if (checkWin()) {
                messageArea.textContent = "Congratulations! You solved it!";
                messageArea.classList.add('win');
                // Disable further input?
                 selectedCell.classList.remove('selected');
                 selectedCell = null;
                 // Disable number pad?
            }

        } else {
            // Incorrect move handling
            const currentAttempts = parseInt(attemptsDisplay.textContent.split('/')[0].trim()) + 1;
            attemptsDisplay.textContent = `${currentAttempts} / ${lives}`;
            selectedCell.classList.add('incorrect'); // Temporarily show incorrect state
             // Maybe remove the number after a short delay?
             setTimeout(() => {
                 if (selectedCell && selectedCell.classList.contains('incorrect')) {
                     selectedCell.classList.remove('incorrect');
                      // Clear the cell text ONLY if it wasn't a valid number for that spot ever
                      // This depends on how you want invalid moves to behave
                     // selectedCell.textContent = '';
                     // workingBoard[row][col] = 0; // Reset internal board if needed
                 }
             }, 500); // Show red for 0.5 seconds


            if (currentAttempts >= lives) {
                messageArea.textContent = "Game Over! Too many mistakes.";
                messageArea.classList.add('lose');
                // Disable input, maybe show solution?
                 selectedCell.classList.remove('selected');
                 selectedCell = null;
                 // Disable number pad?
            }
        }

        // Deselect cell after attempting a move (optional, depends on desired flow)
        // selectedCell.classList.remove('selected');
        // selectedCell = null;
    }

    function handleEraseClick() {
        if (!selectedCell || selectedCell.classList.contains('pre-filled')) return; // Can only erase user-filled cells

        const row = parseInt(selectedCell.dataset.row);
        const col = parseInt(selectedCell.dataset.col);

        workingBoard[row][col] = 0; // Clear internal board state
        selectedCell.textContent = '';
        selectedCell.classList.remove('user-filled', 'incorrect');
    }

    // --- Validation & Win Check (Placeholders) ---

    function isValidMove(row, col, num) {
        // Check against the known solutionBoard
        console.log(`Checking if ${num} is valid at (${row}, ${col}). Solution is ${solutionBoard[row][col]}`);
        return solutionBoard[row][col] === num;
        // --- OR ---
        // Implement traditional Sudoku validation rules (check row, col, 3x3 box)
        // against the current `workingBoard` state. Be careful not to just check
        // against the solution if you want players to figure it out.
        // Example (traditional check):
        // function isSafe(board, r, c, n) {
        //     // Check row
        //     for(let x=0; x<9; x++) if(board[r][x] === n && x !== c) return false;
        //     // Check col
        //     for(let x=0; x<9; x++) if(board[x][c] === n && x !== r) return false;
        //     // Check box
        //     const startRow = r - r % 3, startCol = c - c % 3;
        //     for(let i=0; i<3; i++)
        //         for(let j=0; j<3; j++)
        //             if(board[i+startRow][j+startCol] === n && (i+startRow !== r || j+startCol !== c)) return false;
        //     return true;
        // }
        // return isSafe(workingBoard, row, col, num); // Check against current state
    }

    function checkWin() {
        // Check if the workingBoard matches the solutionBoard OR if workingBoard is full and valid
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (workingBoard[r][c] === 0 || workingBoard[r][c] !== solutionBoard[r][c]) {
                    return false; // Board not full or doesn't match solution
                }
            }
        }
        return true; // Board is full and matches solution
    }

    // --- Initial State ---
    showScreen(difficultyScreen); // Start on the difficulty selection

}); // End DOMContentLoaded