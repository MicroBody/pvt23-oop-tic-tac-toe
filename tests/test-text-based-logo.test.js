import { expect, test } from 'vitest';
import getDocument from './helpers/getDocument.js';
import waitUntil from './helpers/waitUntil.js';

import App from '../classes/App.js';

// make the program sleep less (see classes/helpers/sleep.js)
globalThis.mockMinimalSleep = true;

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

test('Check that player names are registrered correclty', async () => {
  let { body } = getDocument();
  globalThis.mockAnswers = ['Anna', 'Beata'];
  let app = new App();
  // wait until the dom does not have p tag in the main tag with 'Enter names'
  await waitUntil(() =>
    !body.querySelector('main p').innerText.includes('Enter names'));
  // has the app registered the players
  expect(app.playerX.name).toBe('Anna');
  expect(app.playerO.name).toBe('Beata');
});