/**
 * Created by harsh on 4/13/2017.
 */
gameModule.factory('userGameData', userGameData);

function userGameData() {
  var currentLevel;
  var currentCoins;

  function setCurrentLevel(level) {
    currentLevel = level;
  }
  function getCurrentLevel() {
    return currentLevel;
  }
  function setCurrentCoins(coins) {
    currentCoins = coins;
  }
  function getCurrentCoins() {
    return currentCoins;
  }
  var service = {
    setCurrentLevel : setCurrentLevel,
    getCurrentLevel : getCurrentLevel,
    setCurrentCoins : setCurrentCoins,
    getCurrentCoins : getCurrentCoins
  };

  return service;
}
