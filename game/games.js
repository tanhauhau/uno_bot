const Game = require('./game');

class Games {
  constructor() {
    this._games = new Map();
  }
  getGame(chatId) {
    return this._games.get(chatId);
  }
  newGame(chatId) {
    console.log(this._games.has(chatId))
    if (this._games.has(chatId)) {
      throw new Error('Game Exists');
    }
    this._games.set(chatId, new Game());
  }
  endGame(chatId) {
    this._games.delete(chatId);
  }
}

module.exports = new Games();
