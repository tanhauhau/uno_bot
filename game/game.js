const { newShuffledDeck, getCardInfo } = require('./card');
const _ = require('lodash');

class Game {
  constructor() {
    this._players = {};
    this._started = false;
    this._players = null;
    this._decks = null;
  }

  addPlayer(user) {
    this._players[user.id] = user;
  }

  removePlayer(user) {
    delete this._players[user.id];
  }

  startGame() {
    this._started = true;
    this._players = _.chain(this._players)
      .keys()
      .shuffle()
      .values();
    this._decks = newShuffledDeck(this._players.length);
  }
}

module.exports = Game;
