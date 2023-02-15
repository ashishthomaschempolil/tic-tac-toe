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

  const getEmptyCells = () => {
    const emptyCells = []
    board.forEach((cell, index) => {
      if (cell === '') {
        emptyCells.push(index)
      }
    })
    return emptyCells
  }

  return { getBoard, resetBoard, setBoard, getEmptyCells }
})()

// displayController module to handle DOM manipulation
const displayController = (() => {
  let winner = false
  const userChoiceSelect = document.querySelector('#user-choice')
  const userMark = userChoiceSelect.value
  let user = playerFactory('user', userMark)
  let ai = playerFactory('ai', marks.filter((mark) => mark !== userMark)[0])
  let nextTurn = { user: ai, ai: user }
  let currentTurn = user.mark === 'X' ? user : ai
  const cells = document.querySelectorAll('.cell')
  const resetButton = document.querySelector('.reset-button')
  const turnText = document.querySelector('#turn')

  // change the display of the cells when clicked
  const changeGameBoardDisplay = (index, player) => {
    cells[index - 1].textContent = player.mark
    gameBoard.setBoard(index - 1, player.mark)
  }

  // change the turn text to be displayed on top of the board
  const changeTurnText = (currentTurn) => {
    console.log(currentTurn)
    turnText.textContent = `${currentTurn.mark}'s turn`
  }

  // resets the display of the cells when the reset button is clicked
  const changeDisplayOnReset = () => {
    cells.forEach((cell) => {
      cell.textContent = ''
    })
    turnText.textContent = 'X goes first!'
    currentTurn = user.mark === 'X' ? user : ai
    gameBoard.resetBoard()
    winner = false
    if (currentTurn.name === 'ai') {
      aiTurn(ai)
      currentTurn = user
      nextTurn = { user: ai, ai: user }
      changeTurnText(currentTurn)
    }
  }

  // AI logic
  const aiTurn = (ai) => {
    // randomly fills a cell that is not taken
    // get empty cell indexes
    const emptyCells = gameBoard.getEmptyCells()
    // randomly select an index from the empty cells
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    // get the cell id
    const cellId = emptyCells[randomIndex]
    // change the display of the cell
    changeGameBoardDisplay(cellId + 1, ai)

    // check for winner
    checkForWinner()
  }

  // checks for the winner: if there is 3 in a row, column, or diagonal or if its a draw
  const checkForWinner = () => {
    const board = gameBoard.getBoard()

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

    // check for draw
    if (gameBoard.getEmptyCells().length === 0 && !winner) {
      turnText.textContent = 'Draw!'
      winner = true
    }
  }

  // event listeners
  userChoiceSelect.addEventListener('change', (e) => {
    const userMark = e.target.value
    user = playerFactory('user', userMark)
    ai = playerFactory('ai', marks.filter((mark) => mark !== userMark)[0])
    changeDisplayOnReset()
  })

  cells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
      if (e.target.textContent === '' && !winner && currentTurn.name === 'user') {
        // get the id of the cell
        const cellId = Number(e.target.id)
        // change the display of the cell
        changeGameBoardDisplay(cellId, currentTurn)

        // check for winner
        checkForWinner()
        // change the user if the game is not over
        if (!winner) {
          currentTurn = nextTurn[currentTurn.name]
          console.log(currentTurn)
          changeTurnText(currentTurn)

          // AI turn
          // wait 2 seconds before AI turn
          setTimeout(() => {
            // AI turn
            aiTurn(ai)
            // change the user if the game is not over
            if (!winner) {
              currentTurn = nextTurn[currentTurn.name]
              changeTurnText(currentTurn)
            }
          }, 1000)
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
