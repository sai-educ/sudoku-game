document.addEventListener("DOMContentLoaded", function() {
    const cells = Array.from(document.getElementsByClassName('cell'));

    cells.forEach(cell => {
        cell.addEventListener('input', updateCell);
    });
});

function updateCell(event) {
    const cell = event.target;
    const value = cell.value;
    
    // Ensure the input is a number between 1 and 9
    if (value < 1 || value > 9 || isNaN(value)) {
        cell.value = '';
        return;
    }

    // Optionally: Add code to check if the current state of the board is valid
}
