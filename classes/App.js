import Board from './Board.js';

export default class App {

    constructor() {
        this.board = new Board();
        this.board.render();
    }

}