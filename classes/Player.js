import shuffleArray from "./helpers/arrayShuffle.js";
import sleep from './helpers/sleep.js';

export default class Player {

  constructor(name, type, color, board) {
    this.name = name;
    this.type = type;
    this.color = color;
    this.opponent = this.color === 'X' ? 'O' : 'X';
    this.board = board;
  }


  async makeBotMove() {
    // a short delay to make the bot seem more 'human'
    // (simulate that it takes time for it to think)
    await sleep(500);
    let row, column;
    if (this.type === 'A dumb bot') {
      [row, column] = this.makeDumbBotMove();
    }
    if (this.type === 'A smart bot') {
      [row, column] = this.makeSmartBotMove();
    }
    await this.board.makeMove(this.color, row, column);
  }

  makeDumbBotMove() {
    return shuffleArray(this.legalMoves)[0];
  }

  makeSmartBotMove() {
    // orgState - the current state on the board
    let orgState = this.state();
    // try each legal/possible move
    console.log("THE CURRENT STATE", orgState);
    for (let [row, column] of this.legalMoves) {
      let cell = this.board.matrix[row][column];
      cell.color = this.color; // make tempory move
      let futureState = this.state(); // the state if we made this move
      cell.color = ' '; // undo temporary move
      console.log('IF I MADE THE MOVE', row, column);
      console.log('THE NEW STATE WOULD BE', futureState);
    }
  }

  get legalMoves() {
    // which cells are free to choose?
    // (in Connect-4 this would be a check of which columns that are not full instead)
    let moves = [];
    for (let row = 0; row < this.board.matrix.length; row++) {
      for (let column = 0; column < this.board.matrix[0].length; column++) {
        if (this.board.matrix[row][column].color === ' ') {
          moves.push([row, column]);
        }
      }
    }
    return moves;
  }

  state() {
    let state = [];
    for (let winCombo of this.board.winChecker.winCombos) {
      state.push({
        me: winCombo.numberOfCells(this.color),
        opp: winCombo.numberOfCells(this.opponent)
      });
    }
    return state;
  }

}