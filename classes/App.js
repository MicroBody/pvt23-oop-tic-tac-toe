import Dialog from './Dialog.js';
import Board from './Board.js';
import Player from './Player.js';
import sleep from './helpers/sleep.js';

export default class App {

  constructor(playerX, playerO) {
    this.dialog = new Dialog();
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
    const okName = name => name.match(/[a-zåäöA-ZÅÄÖ]{2,}/);
    let playerXName = '', playerOName = '';
    while (!okName(playerXName)) {
      playerXName = await this.dialog.ask('Enter the name of player X:');
      await sleep(500);
    }
    while (!okName(playerOName)) {
      playerOName = await this.dialog.ask('Enter the name of player O:');
      await sleep(500);
    }
    this.playerX = new Player(playerXName, 'X');
    this.playerO = new Player(playerOName, 'O');
    this.namesEntered = true;
    this.render();
  }

  namePossesive(name) {
    // although not necessary, it's nice with a traditional
    // possesive form of the name when it ends with an "s":
    // i.e. "Thomas'" rather than "Thomas's" but "Anna's" :)
    return name + (name.slice(-1).toLowerCase() !== 's' ? `'s` : `'`)
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
        ${!this.board.isADraw ? '' : `<p>It's a tie...</p>`}
        ${!this.board.winner ? '' : `<p>${color}: ${name} won!</p>`}
      `}
      ${this.board.render()}
      <div class="buttons">
        ${!this.board.gameOver ?
        this.renderQuitButton() :
        this.renderPlayAgainButtons()}
      </div>
    `;
  }

  renderQuitButton() {
    if (!this.namesEntered) { return ''; }

    globalThis.quitGame = async () => {
      let answer = await this.dialog.ask(
        'What do you want to do?',
        ['Continue the game', 'Play again', 'Enter new players']
      );
      answer === 'Play again' && new App(this.playerO, this.playerX);
      answer === 'Enter new players' && new App();
    };

    return /*html*/`
      <div class="button" onclick="quitGame()">
        Quit this game
      </div>
    `
  }

  renderPlayAgainButtons() {
    // switch who begins if the same players
    globalThis.playAgain = async () => {
      await this.dialog.ask(
        `It's ${this.namePossesive(this.playerO.name)} turn to start!`, ['OK']);
      new App(this.playerO, this.playerX);
    }

    // start a-fresh with new players
    globalThis.newPlayers = () => new App();

    // why not use the button element? 
    // div tags are easier to style in a cross-browser-compatible way
    return /*html*/`
      <div class="button" href="#" onclick="playAgain()">Play again</div>
      <div class="button" href="#" onclick="newPlayers()">New players</div>
    `;
  }

}