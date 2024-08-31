import Prompt from './Prompt.js';
import Board from './Board.js';
import Player from './Player.js';

export default class App {

  constructor(playerX, playerO) {
    this.prompt = new Prompt();
    this.board = new Board(this);
    if (playerX && playerO) {
      this.playerX = playerX;
      this.playerO = playerO;
      this.namesEntered = true;
    }
    else { this.askForNames(); }
    this.render();
  }

  async askForNames() {
    let playerXName = await this.prompt.ask('Enter a name for player X:');
    let playerOName = await this.prompt.ask('Enter a name for player O:');
    this.playerX = new Player(playerXName, 'X');
    this.playerO = new Player(playerOName, 'O');
    this.namesEntered = true;
    this.render();
  }

  render() {
    let color = this.board.currentPlayerColor;
    let player = color === 'X' ? this.playerX : this.playerO;
    let name = player?.name || '';

    document.querySelector('main').innerHTML = /*html*/`
      <h1>Tic-Tac-Toe</h1>
      ${!this.board.gameOver && player ?
        `<p>${color}: ${this.namePossesive(name)} turn...</p>`
        : (this.namesEntered ? '' : '<p>Enter names</p>')}
      ${!this.board.gameOver ? '' : /*html*/`
        ${!this.board.isADraw ? '' : `<p>It's a tie.</p>`}
        ${!this.board.winner ? '' : `<p>${name} (${color}) won!</p>`}
      `}
      ${this.board.render()}
      ${!this.board.gameOver ? '' : this.renderPlayAgainButtons()}
    `;
  }

  renderPlayAgainButtons() {
    // switch who begins if same players
    globalThis.playAgain = async () => {
      await this.prompt.ask(
        `${this.namePossesive(this.playerO.name)} turn to start!`, true);
      new App(this.playerO, this.playerX);
    }

    // start a-fresh with new players
    globalThis.newPlayers = () => new App();

    // why not use the button element? 
    // div tags are easier to style in a cross-browser-compatible way
    return /*html*/`
      <div class="play-again-buttons">
        <div class="button" href="#" onclick="playAgain()">Play again</div>
        <div class="button" href="#" onclick="newPlayers()">New players</div>
      </div>
    `;
  }

  namePossesive(name) {
    // although not necessary, it's nice with a traditional
    // possesive form of the name when it ends with an "s":
    // i.e. "Thomas'" rather than "Thomas's" but "Anna's" :)
    return name + (name.slice(-1) !== 's' ? `'s` : `'`)
  }

}