import App from './App';
jest.mock('../helpers/prompt');

describe('Tic-Tac-Toe Game', () => {
  let app;

  beforeEach(() => {
    app = new App();
  });

  test('Starting a new game', () => {
    // Mock the user input for starting a new game
    prompt.mockImplementationOnce(() => 'nej');
    app.start();
    expect(app.board.board).toEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
  });

  test('Making a valid move', () => {
    // Mock the user input for making a valid move
    prompt.mockImplementationOnce(() => '1,1');
    prompt.mockImplementationOnce(() => 'nej');
    app.start();
    expect(app.board.board[0][0]).toBe('X');
  });

  test('Winning the game', () => {
    // Mock the user input for winning the game
    prompt.mockImplementationOnce(() => '1,1');
    prompt.mockImplementationOnce(() => '2,2');
    prompt.mockImplementationOnce(() => '3,3');
    prompt.mockImplementationOnce(() => 'nej');
    app.start();
    expect(app.board.winner).toBe('X');
  });

  test('Ending the game in a draw', () => {
    // Mock the user input for ending the game in a draw
    prompt
      .mockImplementationOnce(() => '1,1')
      .mockImplementationOnce(() => '1,2')
      .mockImplementationOnce(() => '1,3')
      .mockImplementationOnce(() => '2,1')
      .mockImplementationOnce(() => '2,2')
      .mockImplementationOnce(() => '2,3')
      .mockImplementationOnce(() => '3,1')
      .mockImplementationOnce(() => '3,2')
      .mockImplementationOnce(() => '3,3')
      .mockImplementationOnce(() => 'nej');
    app.start();
    expect(app.board.winner).toBe(null);
  });

  test('Trying to make an invalid move', () => {
    // Mock the user input for trying to make an invalid move
    prompt
      .mockImplementationOnce(() => '1,1')
      .mockImplementationOnce(() => '1,1')
      .mockImplementationOnce(() => 'nej');
    app.start();
    expect(app.board.board[0][0]).toBe('X');
  });

  test('Playing again after the game is over', () => {
    // Mock the user input for playing again after the game is over
    prompt
      .mockImplementationOnce(() => 'ja')
      .mockImplementationOnce(() => '1,1')
      .mockImplementationOnce(() => '2,2')
      .mockImplementationOnce(() => '3,3')
      .mockImplementationOnce(() => 'nej');
    app.start();
    expect(app.board.board).toEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
  });
});