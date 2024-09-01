import Dialog from './Dialog.js';
import Board from './Board.js';
import Player from './Player.js';
import sleep from './helpers/sleep.js';

export default class App {

  constructor(playerX, playerO, whoStarts = 'X') {
    this.dialog = new Dialog();
    this.board = new Board(this);
    this.board.currentPlayerColor = whoStarts;
    this.whoStarts = whoStarts;
    this.setPlayAgainGlobals();
    if (playerX && playerO) {
      this.playerX = playerX;
      this.playerO = playerO;
      // set the new board for the 'old' players
      this.playerX.board = this.board;
      this.playerO.board = this.board;
      // we now the players already :)
      this.namesEntered = true;
    }
    else { this.askForPlayerNameAndType(); }
    this.render();
  }

  async askForPlayerNameAndType(color = 'X') {
    const okName = name => name.match(/[a-zåäöA-ZÅÄÖ]{2,}/);
    let playerName = '';
    while (!okName(playerName)) {
      playerName = await this.dialog.ask(`Enter the name of player ${color}:`);
      await sleep(500);
    }
    let playerType = await this.dialog.ask(
      `What type of player is ${playerName}?`,
      ['Human', 'Computer']
    );
    this['player' + color] =
      new Player(playerName, color, playerType === 'Computer', this.board);
    if (color === 'X') { this.askForPlayerNameAndType('O'); return; }
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

    // import - before render lock the board from input if 
    // player (the player whose turn it is) is a computer
    this.board.lockedFromInput = player?.isBot;

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
    // if the player whose turn it is a bot, tell it to make its move
    if (!this.board.gameOver && player?.isBot) { player.makeMove(); }
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

  setPlayAgainGlobals() {
    // play again 
    globalThis.playAgain = async () => {
      let playerToStart = this.whoStarts === 'X' ? this.playerO : this.playerX;
      await this.dialog.ask(
        `It's ${this.namePossesive(playerToStart.name)} turn to start!`, ['OK']);
      new App(this.playerX, this.playerO, playerToStart.color);
    }
    // start a-fresh with new players
    globalThis.newPlayers = () => new App();
  }

  renderPlayAgainButtons() {
    // why not use the button element? 
    // div tags are easier to style in a cross-browser-compatible way
    return /*html*/`
      <div class="button" href="#" onclick="playAgain()">Play again</div>
      <div class="button" href="#" onclick="newPlayers()">New players</div>
    `;
  }

}