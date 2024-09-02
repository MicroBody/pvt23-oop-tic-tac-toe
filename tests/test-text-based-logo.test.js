import { expect, test } from 'vitest';
import { Window } from "happy-dom";
import App from '../classes/App.js';

test('Does the logo/headline have the text "Tic-Tac-Toe" ?', () => {
  // create a mocked browser window and get its document
  const document = new Window().document;
  // make document available to the program code
  globalThis.document = document;
  // create the basic html structure from index.html
  document.body.innerHTML = '<main></main><dialog</dialog>';
  // create a new app
  new App();
  // check that the h1 contains the text 'Tic-Tac-Toe';
  let h1 = document.body.querySelector('h1');
  expect(h1.innerText).toEqual('Tic-Tac-Toe');
})