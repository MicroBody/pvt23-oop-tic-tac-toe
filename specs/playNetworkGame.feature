Feature: Play a game in the network

  Scenario: Start a game
    Given that we are two players and one creates a game and one joins it
    Then we should both see that its the first players turn