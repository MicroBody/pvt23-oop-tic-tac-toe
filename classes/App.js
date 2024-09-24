import Dialog from './Dialog.js';
import Board from './Board.js';
import Player from './Player.js';
import Network from './helpers/Network.js';
import sleep from './helpers/sleep.js';
import generateCode from './helpers/generateCode.js';

export default class App {

  constructor(playerX, playerO, whoStarts = 'X', networkPlay = false, networkRole, myColor) {

    // network related properties
    this.networkPlay = networkPlay;
    this.networkRole = networkRole // is set in the askIfNetworkPlay method
    this.myColor = myColor;
    this.allowBotsInNetworkPlay = false; // for future development (tournaments between bots

    this.dialog = new Dialog();
    this.board = new Board(this);
    this.board.currentPlayerColor = whoStarts;
    this.whoStarts = whoStarts;
    this.setPlayAgainGlobals();
    // replay with existing player
    if (playerX && playerO) {
      this.playerX = playerX;
      this.playerO = playerO;
      // update players so that they know about the new borard
      this.playerX.board = this.board;
      this.playerO.board = this.board;
      // start the new game
      this.namesEntered = true;
      this.board.initiateBotMove();
      // if network play, then replace the listener 
      // (that belongs to the old app / game) with a new one
      if (networkPlay) {
        Network.replaceListener(obj => this.networkListener(obj));
      }
    }
    // enter new players
    else { this.askForNamesAndTypes(); }
    this.render();
  }

  async askIfNetworkPlay() {
    this.networkPlay = (await this.dialog.ask(
      `Network Play: Do you want to play<br>against a friend via the Internet?`, ['Yes', 'No'])) === 'Yes';
    await sleep(500);
    if (!this.networkPlay) { return; }
    let startNetworkPlay = (await this.dialog.ask(
      'Do you want to create a new network game? Or join one?', ['Create', 'Join'])) === 'Create';
    await sleep(500);
    let name = await this.dialog.ask('Enter your name:');
    await sleep(500);
    if (startNetworkPlay) {
      this.networkRole = 'primary';
      let code = generateCode();
      Network.startConnection(name, code, obj => this.networkListener(obj));
      let extra = '';
      while (!this.bothNetworkPlayersHasJoined) {
        await this.dialog.ask(
          `Send the following join code to your friend:<br>
          <input type="text" name="joinCode" readonly value="${code}">${extra}`, ['OK']);
        extra = '<br>Waiting for your friend to join...'
        await sleep(500);
      }
    }
    else {
      this.networkRole = 'subordinate';
      let extra = '';
      while (!this.bothNetworkPlayersHasJoined) {
        let code = await this.dialog.ask(`Enter a the join code you got from your friend:${extra}`);
        this.joiners = [];
        this.enteredJoinCode = code;
        Network.startConnection(name, code, obj => this.networkListener(obj));
        extra = '<br>Incorrect join code... Try again...';
        await sleep(500);
      }
    }
    // create players
    this.playerX = new Player(this.joiners.shift(), 'Human', 'X', this.board);
    this.playerO = new Player(this.joiners.shift(), 'Human', 'O', this.board);
    this.myColor = this.networkRole === 'primary' ? 'X' : 'O';
    this.namesEntered = true;
    this.render();
  }

  networkListener({ user, timestamp, data }) {
    // keep this console.log until you understand how 
    // and which network messages are sent
    console.log(user, timestamp, data);

    // wait for both players to join
    this.joiners = this.joiners || [];
    if (user === 'system' && data.includes('joined channel')) {
      this.joiners.push(data.split(' ')[1]);
      this.bothNetworkPlayersHasJoined = this.joiners.length >= 2;
    }

    // remove dialog/modal for primary player when the second player has joined
    if (this.networkRole === 'primary'
      && this.bothNetworkPlayersHasJoined
      && document.querySelector('dialog input[name="joinCode"]')
    ) {
      let okButton = document.querySelector('dialog .button.OK');
      okButton && okButton.click();
    }

    // make move sent to us from opponent via the network
    if (data.networkRole && data.color) {
      let { color, row, column } = data;
      this.board.makeMove(color, row, column, false) && this.render();
    }

    // if playAgain sent to subordinate from primary then play again
    if (this.networkRole === 'subordinate' && data.action === 'playAgain') {
      globalThis.playAgain();
    }
  }

  async askForNamesAndTypes(color = 'X') {
    color === 'X' && await this.askIfNetworkPlay();
    if (this.networkPlay) { return; }
    const okName = name => name.match(/[a-zåäöA-ZÅÄÖ]{2,}/);
    let playerName = '';
    let playerType = '';
    while (!okName(playerName)) {
      playerName = await this.dialog.ask(`Enter the name of player ${color}:`);
      if (!this.networkPlay || this.allowBotsInNetworkPlay) {
        await sleep(500);
        playerType = await this.dialog.ask(
          `Which type of player is ${playerName}?`,
          ['Human', 'A dumb bot', 'A smart bot']
        )
      }
      else {
        playerType = 'Human';
      }
    }
    this['player' + color] = new Player(playerName, playerType, color, this.board);
    if (color === 'X' && !this.networkPlay) { this.askForNamesAndTypes('O'); return; }
    this.namesEntered = true;
    this.render();
    this.board.initiateBotMove();
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

    if (this.networkPlay && this.myColor !== this.board.currentPlayerColor) {
      document.body.classList.add('notMyTurn');
    }
    else {
      document.body.classList.remove('notMyTurn');
    }
  }

  renderQuitButton() {
    if (!this.namesEntered) { return ''; }

    // don't show button for the joining player during network play
    if (this.networkPlay && this.networkRole === "subordinate") { return ''; }

    globalThis.quitGame = async () => {
      let answer = await this.dialog.ask(
        'What do you want to do?',
        ['Continue the game', 'Play again', 'Enter new players']
      );
      answer === 'Play again' && globalThis.playAgain();
      answer === 'Enter new players' && globalThis.newPlayers();
    };

    return /*html*/`
      <div class="button" onclick="quitGame()">
        Quit this game
      </div>
    `;
  }

  setPlayAgainGlobals() {
    // play again 
    globalThis.playAgain = async () => {
      let playerToStart = this.whoStarts === 'X' ? this.playerO : this.playerX;
      // if primary network player send 'playAgain' to subordinate player
      if (this.networkPlay && this.networkRole === 'primary') {
        Network.send({ action: 'playAgain' });
      }
      await this.dialog.ask(
        `It's ${this.namePossesive(playerToStart.name)} turn to start!`, ['OK']);
      new App(this.playerX, this.playerO, playerToStart.color,
        this.networkPlay, this.networkRole, this.myColor);
    }
    // start a-fresh with new players
    globalThis.newPlayers = () => new App();
  }

  renderPlayAgainButtons() {

    // don't show buttons for the joining player during network play
    if (this.networkPlay && this.networkRole === "subordinate") { return ''; }

    // why not use the button element? 
    // div tags are easier to style in a cross-browser-compatible way
    return /*html*/`
      <div class="button" href="#" onclick="playAgain()">Play again</div>
      <div class="button" href="#" onclick="newPlayers()">New players</div>
    `;
  }

}