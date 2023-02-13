/* eslint-disable no-unused-vars */
// playerFactory function to create player objects
// which will be used to store player names and marks
const marks = ['X', 'O']

const playerFactory = (name, mark) => {
  return { name, mark }
}

// gameBoard module to store the game board array and methods
const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', '']

  const getBoard = () => board

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', '']
  }

  const setBoard = (index, mark) => {
    board[index] = mark
  }

  return { getBoard, resetBoard, setBoard }
})()

// displayController module to handle DOM manipulation
const displayController = (() => {
  let mark = 'X'
  let winner = false
  const nextTurn = { X: 'O', O: 'X' }
  const cells = document.querySelectorAll('.cell')
  const resetButton = document.querySelector('.reset-button')
  const turnText = document.querySelector('#turn')

  /* @param index: the index of the cell in the gameBoard array
      * @param mark: the mark of the player
      * @return: none
      * changes the display of the gameBoard module for the particular cell
  * */
  const changeGameBoardDisplay = (index, mark) => {
    cells[index - 1].textContent = mark
    gameBoard.setBoard(index - 1, mark)
  }
  
  /* @param mark: the mark of the player
      * @return: none
      * changes the display of the turn text
      * */
  const changeTurnText = (mark) => {
    turnText.textContent = `${mark}'s turn`
  }

  const changeDisplayOnReset = () => {
    cells.forEach((cell) => {
      cell.textContent = ''
    })
    changeTurnText(mark)
    mark = 'X'
    winner = false
  }

  const checkForWinner = () => {
    const board = gameBoard.getBoard()
    // check for winning combos ie rows, columns, diagonals
    // do not manually check for all 8 winning combos
    // use a loop to check for all 8 winning combos
    for (let i = 0; i < 3; i++) {
      // check for rows
      if (
        board[i * 3] === board[i * 3 + 1] &&
        board[i * 3] === board[i * 3 + 2] &&
        board[i * 3] !== ''
      ) {
        turnText.textContent = `${board[i * 3]} wins!`
        winner = true
      }
      // check for columns
      if (
        board[i] === board[i + 3] &&
        board[i] === board[i + 6] &&
        board[i] !== ''
      ) {
        turnText.textContent = `${board[i]} wins!`
        winner = true
      }
    }
    // check for diagonals
    if (
      board[0] === board[4] &&
      board[0] === board[8] &&
      board[0] !== ''
    ) {
      turnText.textContent = `${board[0]} wins!`
      winner = true
    }
    if (
      board[2] === board[4] &&
      board[2] === board[6] &&
      board[2] !== ''
    ) {
      turnText.textContent = `${board[2]} wins!`
      winner = true
    }
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
      if (e.target.textContent === '' && !winner) {
        // get the id of the cell
        const cellId = Number(e.target.id)
        // change the display of the cell
        changeGameBoardDisplay(cellId, mark)

        // check for winner
        checkForWinner()
        // change the mark if the game is not over
        if (!winner) {
          mark = nextTurn[mark]
          changeTurnText(mark)
        }
      }
    })
  })

  // Resets the game board and displays
  resetButton.addEventListener('click', (e) => {
    gameBoard.resetBoard()
    changeDisplayOnReset()
  })
})()
