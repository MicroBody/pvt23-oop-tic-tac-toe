import WinCombo from "./WinCombo.js";

export default class WinChecker {

  constructor(board) {
    this.board = board;
    this.matrix = board.matrix;
    // 8 different winCombos for Tic-Tac-Toe
    // (had it been Connect-4 we would 69 winCombos)
    this.winCombos = [];
    this.calculateWinCombos();
  }

  // calculate all the win combos once and remember them
  // this programming pattern is called memoization
  // (and helps save processing power / speeds up the program)
  calculateWinCombos() {
    // m - a short alias for this.matrix
    let m = this.matrix;
    // represent ways you can win as offset from ONE position on the board
    let offsets = [
      [[0, 0], [0, 1], [0, 2]],  // horizontal win
      [[0, 0], [1, 0], [2, 0]],  // vertical win
      [[0, 0], [1, 1], [2, 2]],  // diagonal 1 win
      [[0, 0], [1, -1], [2, -2]] // diagonal 2 win
    ];
    // loop through the board to find all winCombos

    // r = row, c = column
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[0].length; c++) {
        // ro = row offset, co = column offset
        for (let winType of offsets) {
          let combo = [];
          for (let [ro, co] of winType) {
            if (r + ro < 0 || r + ro >= m.length) { continue; }
            if (c + co < 0 || c + co >= m[0].length) { continue; }
            combo.push(m[r + ro][c + co]);
          }
          if (combo.length === 3) {
            this.winCombos.push(new WinCombo(combo));
          }
        }
      }
    }
  }

  winCheck() {
    for (let winCombo of this.winCombos) {
      if (winCombo.isWin('X')) { this.board.winningCombo = winCombo; return 'X'; }
      if (winCombo.isWin('O')) { this.board.winningCombo = winCombo; return 'O'; }
    }
    return false;
  }

}