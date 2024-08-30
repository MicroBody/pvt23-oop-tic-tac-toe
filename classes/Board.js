export default class Board {

  constructor() {
    // A simple way of generating the board
    // - but no so flexible
    /*this.matrix = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];*/
    // A slighly more complex way of generating the board
    // - more flexible since we can change
    // how many rows and columns easily
    this.matrix = [...new Array(3)].map(row =>
      [...new Array(3)].map(column => ' ')
    );
    // currentPlayer, whose turn is it?
    this.currentPlayerColor = 'X';
    // status of game (updated after each move)
    this.winner = false;
    this.isADraw = false;
    this.gameOver = false;
  }

  // render = output/draw something
  render() {
    // A basic way of showing the board
    // console.table(this.matrix);
    // A more customized board with our own 
    // characters forrow and column separation
    let line = '\n' + '-'.repeat(13) + '\n';
    console.log(
      line +
      this.matrix.map(row =>
        row.map(column => `| ${column} `).join('')
        + '|').join(line) +
      line
    );
  }

  makeMove(color, row, column) {
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
    if (this.matrix[row][column] !== ' ') { return false; }

    // make the move
    this.matrix[row][column] = color;
    // change the current player color
    this.currentPlayerColor = this.currentPlayerColor === 'X' ? 'O' : 'X';
    // check if someone has won or if it's a draw/tie and update properties
    this.winner = this.winCheck();
    this.isADraw = this.drawCheck();
    // the game is over if someone has won or if it's a draw
    this.gameOver = this.winner || this.isADraw;
    // return true if the move could be made
    return true;
  }

  winCheck() {
    // m - a short alias for this.matrix
    let m = this.matrix;
    // represent ways you can win as offset from ONE position on the board
    let offsets = [
      [[0, 0], [0, 1], [0, 2]],  // horizontal win
      [[0, 0], [1, 0], [2, 0]],  // vertical win
      [[0, 0], [1, 1], [2, 2]],  // diagonal 1 win
      [[0, 0], [1, -1], [2, -2]] // diagonal 2 win
    ];
    // loop through each player color, each position (row + column),
    // each winType/offsets and each offset coordinate added to the position
    // to check if someone has won :)
    for (let color of 'XO') {
      // r = row, c = column
      for (let r = 0; r < m.length; r++) {
        for (let c = 0; c < m[0].length; c++) {
          // ro = row offset, co = column offset
          for (let winType of offsets) {
            let colorsInCombo = '';
            for (let [ro, co] of winType) {
              colorsInCombo += (m[r + ro] || [])[c + co];
            }
            if (colorsInCombo === color.repeat(3)) {
              return color;
            }
          }
        }
      }
    }
    return false;
  }

  // check for a draw/tie
  drawCheck() {
    // if no one has won and no empty positions then it's a draw
    return !this.winCheck() && !this.matrix.flat().includes(' ');
  }

}