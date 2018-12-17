const { newShuffledDeck, getCardInfo } = require('./deck');
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

  getPlayerCards(user) {
    const playerIdx = _.indexOf(this._players, user.id);
    const isPlayerTurn = this._decks.turn === playerIdx;
    return this._decks.playerPiles[playerIdx].map(card => {
      return {
        type: 'sticker',
        id: isPlayerTurn ? card.sticker.enabled : card.sticker.disabled,
        sticker_file_id: isPlayerTurn
          ? card.sticker.enabled
          : card.sticker.disabled
      };
    });
  }
}

module.exports = Game;
