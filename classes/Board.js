import Cell from './Cell.js';
import WinChecker from './WinChecker.js';

export default class Board {

  constructor(app) {
    this.app = app;
    this.matrix = [...new Array(3)].map((row, rowIndex) =>
      [...new Array(3)].map((column, columnIndex) =>
        new Cell(rowIndex, columnIndex))
    );
    // create a new winChecker
    this.winChecker = new WinChecker(this);
    // currentPlayer, whose turn is it?
    this.currentPlayerColor = 'X';
    // status of game (updated after each move)
    this.winner = false;
    this.isADraw = false;
    this.gameOver = false;
    this.winningCombo = null;
  }

  render() {
    // create the event handler called on click:
    // makeMove and if makeMove returns true
    // then call the app render method
    globalThis.makeMoveOnClick = (row, column) =>
      this.makeMove(this.currentPlayerColor, row, column, true)
      && this.app.render();

    // set some statuses as attributes to the body
    // so we can apply different styling depending on them
    document.body.setAttribute('currentPlayerColor',
      this.gameOver ? '' : this.currentPlayerColor);
    document.body.setAttribute('gameInProgress',
      this.app.namesEntered && !this.gameOver);

    // render the board as html
    return /*html*/`<div class="board">
      ${this.matrix.map((row, rowIndex) =>
      row.map((cell, columnIndex) =>/*html*/`
        <div
          class="cell ${cell} 
          ${this.winningCombo && this.winningCombo.cells.find(
        cell => cell.row === rowIndex && cell.column === columnIndex
      ) ? 'in-win' : ''}"
          onclick="makeMoveOnClick(${rowIndex},${columnIndex})">
        </div>
      `).join('')).join('')}
    </div>`;
  }

  makeMove(color, row, column, fromClick) {
    let player = color === 'X' ? this.app.playerX : this.app.playerO;
    // don't allow move fromCLick if it's a bots turn to play
    if (fromClick && player.type !== 'Human') { return; }
    // don't make any move if the game is over
    if (this.gameOver) { return false; }
    // check that the color is X or O - otherwise don't make the move
    if (color !== 'X' && color !== 'O') { return false; }
    // check that the color matches the player's turn - otherwise don't make the move
    if (color !== this.currentPlayerColor) { return false; }
    // check that the row and column are numbers - otherwise don't make the move
    if (isNaN(row) || isNaN(column)) { return false; }
    // check that the row is between 0 and 2 - otherwise don't make the move
    if (row < 0 || row >= this.matrix.length) { return false; }
    // check that the column is between 0 and 2 - otherwise don't make the move
    if (column < 0 || column >= this.matrix[0].length) { return false; }
    // check that the position is empty - otherwise don't make the move
    if (this.matrix[row][column].color !== ' ') { return false; }

    // make the move
    this.matrix[row][column].color = color;
    // check if someone has won or if it's a draw/tie and update properties
    this.winner = this.winCheck();
    this.isADraw = this.drawCheck();
    // the game is over if someone has won or if it's a draw
    this.gameOver = this.winner || this.isADraw;
    // change the current player color, if the game is not over
    !this.gameOver
      && (this.currentPlayerColor = this.currentPlayerColor === 'X' ? 'O' : 'X');
    // make bot move if the next player is a bot
    this.initiateBotMove();
    // return true if the move could be made
    return true;
  }

  winCheck() {
    return this.winChecker.winCheck();
  }

  // check for a draw/tie
  drawCheck() {
    // if no one has won and no empty positions then it's a draw
    return !this.winCheck() &&
      !this.matrix.flat().map(cell => cell.color).includes(' ');
  }

  // note: this does nothing if the player is a human
  async initiateBotMove() {
    // get the current player
    let player = this.currentPlayerColor === 'X' ? this.app.playerX : this.app.playerO;
    // if the game isn't over and the player exists and the player is non-human / a bot
    if (!this.gameOver && player && player.type !== 'Human') {
      await player.makeBotMove();
      this.app.render();
    }
  }

}