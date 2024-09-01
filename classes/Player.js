import sleep from './helpers/sleep.js';

export default class Player {

  constructor(name, color, isBot, board) {
    this.name = name;
    this.color = color;
    this.isBot = isBot;
    this.board = board;
  }

  async makeMove() {
    // make a stupid random move after a short delay 
    // (so it appear the bot 'thinks')
    await sleep(1000);
    let row, column;
    do {
      row = Math.floor(Math.random() * 3);
      column = Math.floor(Math.random() * 3);
    } while (!this.board.makeMove(this.color, row, column, true));
    this.board.app.render();
  }

}