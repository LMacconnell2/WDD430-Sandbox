const resetGameBtn = document.getElementById('reset');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turn-indicator');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let moveHistory = [];
let redoStack = [];

console.log("Tic Tac Toe Game Initialized");

function handleReset() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    moveHistory = [];
    redoStack = [];
    currentPlayer = 'X';
    turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => cell.textContent = '');
    cells.forEach(cell => cell.disabled = false);
    cells.forEach(cell => cell.classList.remove('taken')); // Remove the 'taken' class from all cells
}

function handleUndo() {
    if (moveHistory.length === 0) return;
    const lastMove = moveHistory.pop();
    gameState[lastMove.index] = '';
    cells[lastMove.index].textContent = '';
    redoStack.push(lastMove);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
}

function handleRedo() {
    if (redoStack.length === 0) return;
    const lastUndoneMove = redoStack.pop();
    gameState[lastUndoneMove.index] = lastUndoneMove.player;
    cells[lastUndoneMove.index].textContent = lastUndoneMove.player;
    moveHistory.push(lastUndoneMove);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
}

function handleCellClick(event) {
    //Get the index of the clicked cell
    const cellIndex = Array.from(cells).indexOf(event.target);
    //Check if the cell is already occupied
    if (gameState[cellIndex] !== '') return;
    //If the cell is not occupied: 
    //7. Switch to the other player's turn and update the turn indicator
    //1. Get the current players turn
    //2. Update the game state array with the current player's symbol at the clicked cell's index
    gameState[cellIndex] = currentPlayer;
    //3. Update the clicked cell's text content to show the current player's symbol
    // - get the current cell, then set its text content to the currrent player's symbol.
    cells[cellIndex].textContent = currentPlayer;
    cells[cellIndex].classList.add('taken'); // Add a class to visually indicate the cell is taken

    //4. Add the move to the move history stack
    moveHistory.push({ index: cellIndex, player: currentPlayer });

    //5. Clear the redo stack (since a new move invalidates any previously undone moves)
    redoStack = [];

    //6. Check for a win or draw condition (not implemented in this code snippet)
    if (checkWin()) {
        turnIndicator.textContent = `Player ${currentPlayer} Wins!`;
        cells.forEach(cell => cell.disabled = true); // Disable all cells after a win
    } else if (gameState.every(cell => cell !== '')) {
        turnIndicator.textContent = "It's a Draw!";
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
    }


}

function checkWin() {
    //Define all possible winning combinations (rows, columns, diagonals)
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    //Loop through each winning combination and check if the game state matches any of them for the current player
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return true;
        }
    }

    //If no winning combination is found after checking all possibilities, return false
    return false;
}

//Add event listeners to the reset, undo, and redo buttons
resetGameBtn.addEventListener('click', handleReset);
undoBtn.addEventListener('click', handleUndo);
redoBtn.addEventListener('click', handleRedo);

//Add event listeners to each cell in the game board to handle player moves
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

//Initialize the game by resetting it to the starting state
handleReset();