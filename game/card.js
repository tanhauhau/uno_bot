const deck = require('./deck.json');
const _ = require('lodash');
const deckMap = _.keyBy(deck, 'id');
const invariant = require('invariant');

const CARD_PER_PLAYER = 7;

function newShuffledDeck(numPlayers) {
  const drawPile = _.chain(deck)
    .map(d => _.times(d.qty, _.constant(d.id)))
    .flatten()
    .shuffle()
    .value();
  const playerPiles = _.times(numPlayers, () => drawPile.splice(0, 7));
  return {
    drawPile,
    playerPiles,
    playedPile: [],
    turn: 0,
    direction: 1
  };
}

function getCardInfo(id) {
  return deckMap[id];
}

function nextTurn(turn, direction, numPlayer) {
  return (turn + direction + numPlayer) % numPlayer;
}

function canPlay(currentCard, prevCard) {
  const currentInfo = getCardInfo(currentCard);
  const prevInfo = getCardInfo(prevCard);
  return (
    !prevInfo ||
    prevInfo.color === currentInfo.color ||
    prevInfo.value === currentInfo.value ||
    prevInfo.type === 'WILD' ||
    prevInfo.type === 'PLUSFOUR'
  );
}

function isReverse(cardId) {
  return getCardInfo(cardId).type === 'REVERSE';
}

function shouldSkip(cardId) {
  return _.includes(['SKIP', 'PLUSFOUR', 'PLUSTWO'], getCardInfo(cardId).type);
}

function getDirection(prevDir, cardToPlay) {
  let direction = prevDir;
  if (isReverse(cardToPlay)) {
    direction *= -1;
  } else if (shouldSkip(cardToPlay)) {
    direction *= 2;
  }
  return direction;
}

function play(deck, playerIdx, cardIdx) {
  invariant(playerIdx < deck.playerPiles.length, 'No such player');
  invariant(cardIdx < deck.playerPiles[playerIdx].length, 'No such card');
  invariant(deck.turn === playerIdx, 'Not your turn!');

  const cardToPlay = deck.playerPiles[playerIdx][cardIdx];
  invariant(
    canPlay(cardToPlay, deck.playedPile[deck.playedPile.length - 1]),
    `Cannot play ${cardToPlay} with ${
      deck.playedPile[deck.playedPile.length - 1]
    }`
  );

  let direction = getDirection(deck.direction, cardToPlay);

  const result = {
    ...deck,
    playerPiles: [...deck.playerPiles],
    playedPile: [...deck.playedPile],
    turn: nextTurn(deck.turn, direction, deck.playerPiles.length),
    direction
  };
  result.playedPile.push(result.playerPiles[playerIdx].splice(cardIdx, 1));
  return result;
}

function draw(deck, playerIdx) {
  invariant(playerIdx < deck.playerPiles.length, 'No such player');
  invariant(deck.drawPile.length > 0, 'No more card in draw pile');
  invariant(deck.turn === playerIdx, 'Not your turn!');

  const result = {
    ...deck,
    drawPile: [...deck.drawPile],
    playerPiles: [...deck.playerPiles],
    turn: nextTurn(deck.turn, deck.direction, deck.playerPiles.length)
  };
  result.playerPiles[playerIdx].push(result.drawPile.splice(0, 1)[0]);
  return result;
}

function pass(deck, playerIdx) {
  invariant(deck.turn === playerIdx, 'Not your turn!');
  return {
    ...deck,
    turn: nextTurn(deck.turn, deck.direction, deck.playerPiles.length)
  };
}

module.exports.newShuffledDeck = newShuffledDeck;
module.exports.getCardInfo = getCardInfo;

module.exports.play = play;
module.exports.draw = draw;
module.exports.pass = pass;
