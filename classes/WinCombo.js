import Cell from './Cell.js';

export default class WinCombo {

  // cells should be an array of Cells
  constructor(cells) {
    // filter cells so it only contains instances of Cell
    cells = cells.filter(x => x instanceof Cell);
    // if we don't have three cells in the array something is wrong
    if (cells.length !== 3) {
      throw new Error('Each win combo must contain 3 cells.');
    }
    this.cells = cells;
  }

  numberOfCells(color) {
    // return how many cells in this WinCombo that has a certain color
    return this.cells.filter(cell => cell.color === color).length;
  }

  isWin(color) {
    // if all three cells are the same color we have a win
    return this.numberOfCells(color) === 3;
  }

}