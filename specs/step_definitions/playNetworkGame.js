import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { getIframeBody } from '../helpers/iframe.js';

Given('that we are two players and one creates a game and one joins it', () => {

  // visit the 'helper' we set up with two iframes
  // where each iframe emulates one player in a network
  cy.visit('/iframed-network-play.html');

  // player X - first player - start network game and get code
  getIframeBody('iframe#playerX').find('.button.Yes').click();
  getIframeBody('iframe#playerX').find('.button.Create').click();
  getIframeBody('iframe#playerX').find('input[name="answer"]').type('Anna{enter}');
  getIframeBody('iframe#playerX').find('input[name="joinCode"]').then(element => {
    // we have the join code
    let joinCode = element.val();

    // player O - second player join the game
    getIframeBody('iframe#playerO').find('.button.Yes').click();
    getIframeBody('iframe#playerO').find('.button.Join').click();
    getIframeBody('iframe#playerO').find('input[name="answer"]').type('Beata{enter}');
    getIframeBody('iframe#playerO').find('dialog:contains("join code") input[name="answer"]')
      .type(joinCode + '{enter}');
  });
});

Then('we should both see that its the first players turn', () => {
  // Expect both players to have 'X: Anna's turn...' displayed on their screens
  getIframeBody('iframe#playerX').find('p:contains("X: Anna\'s turn...")');
  getIframeBody('iframe#playerO').find('p:contains("X: Anna\'s turn...")');
});