import random

def generate_sudoku():
    base = 3
    side = base * base

    def pattern(r, c):
        return (base * (r % base) + r // base + c) % side

    def shuffle(s):
        return random.sample(s, len(s))

    rBase = range(base)
    rows = [g * base + r for g in shuffle(rBase) for r in shuffle(rBase)]
    cols = [g * base + c for g in shuffle(rBase) for c in shuffle(rBase)]
    nums = shuffle(range(1, side + 1))

    board = [[nums[pattern(r, c)] for c in cols] for r in rows]

    squares = side * side
    empties = squares * 3 // 4
    for p in random.sample(range(squares), empties):
        board[p // side][p % side] = 0

    return board

def print_board(board):
    for i, row in enumerate(board):
        if i % 3 == 0 and i != 0:
            print("- - - - - - - - - - - -")
        for j, num in enumerate(row):
            if j % 3 == 0 and j != 0:
                print("|", end=" ")
            if num == 0:
                print(".", end=" ")
            else:
                print(num, end=" ")
        print()

def is_valid_move(board, row, col, num):
    for x in range(9):
        if board[row][x] == num:
            return False
    for x in range(9):
        if board[x][col] == num:
            return False
    start_row = row - row % 3
    start_col = col - col % 3
    for i in range(3):
        for j in range(3):
            if board[i + start_row][j + start_col] == num:
                return False
    return True

def solve_sudoku(board):
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                for num in range(1, 10):
                    if is_valid_move(board, i, j, num):
                        board[i][j] = num
                        if solve_sudoku(board):
                            return True
                        board[i][j] = 0
                return False
    return True

def play_sudoku():
    board = generate_sudoku()
    print("Welcome to Sudoku!")
    print("Enter row, column, and number (e.g., '3 4 5') or 'q' to quit.")
    while True:
        print_board(board)
        move = input("Enter your move: ")
        if move.lower() == 'q':
            print("Thanks for playing!")
            break
        try:
            row, col, num = map(int, move.split())
            if is_valid_move(board, row - 1, col - 1, num):
                board[row - 1][col - 1] = num
            else:
                print("Invalid move. Try again.")
        except ValueError:
            print("Invalid input. Please enter row, column, and number.")

if __name__ == "__main__":
    play_sudoku()