import { expect, test } from 'vitest';

// some helpers for mocking
import getDocument from './helpers/mock-help/getDocument.js';
import click from './helpers/mock-help/triggerOnclick.js';

// other helpers for mocking not used right now
// import sleep from './helpers/mock-help/getDocument.js';
// import waitUntil from './helpers/mock-help/waitUntil.js';

// A common task - something we do in the prgoram flow
// in several tests
import registerPlayers from './helpers/commonTasks/registerPlayers.js';

// The App class from the program
import App from '../classes/App.js';


test('Does the logo/headline have the text "Tic-Tac-Toe" ?', () => {
  let { body } = getDocument();
  new App();
  // check that the h1 contains the text 'Tic-Tac-Toe';
  let h1 = body.querySelector('h1');
  expect(h1.innerText).toBe('Tic-Tac-Toe');
});

test('Does the board contain 9 cells?', () => {
  let { body } = getDocument();
  new App();
  let board = body.querySelector('.board');
  let cells = board.querySelectorAll('.cell')
  expect(cells.length).toBe(9);
});

test('Check that player names are registrered correctly', async () => {
  await registerPlayers();
});

test('Make the first two moves and check they are appear on the board', async () => {
  let body = await registerPlayers();
  // click the position/cell in the middle of the board (cell 5);
  click(body.querySelector('.cell:nth-child(5)'));
  // check that X is added to the cell we just clicked
  expect(body.querySelector('.cell:nth-child(5)').classList.contains('X')).toBeTruthy();
  // click the cell to the left of the middle cell (cell 4)
  click(body.querySelector('.cell:nth-child(4)'));
  // check that O is added to the cell we just clicked
  expect(body.querySelector('.cell:nth-child(4)').classList.contains('O')).toBeTruthy();
});