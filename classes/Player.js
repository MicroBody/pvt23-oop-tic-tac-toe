import shuffleArray from "./helpers/arrayShuffle.js";
import sleep from './helpers/sleep.js';

export default class Player {

  constructor(name, type, color, board) {
    this.name = name;
    this.type = type;
    this.color = color;
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
      // REMEMBER: CHANGE TO CALL TO this.makeSmartBotMove
      // when we have a smart bot
      [row, column] = this.makeDumbBotMove();
    }
    await this.board.makeMove(this.color, row, column);
  }

  makeDumbBotMove() {
    return shuffleArray(this.legalMoves)[0];
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

}