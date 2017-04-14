/**
 * Created by harsh on 4/13/2017.
 */
gameModule.factory('userGameData', userGameData);

function userGameData() {
  var currentLevel;

  function setCurrentLevel(level) {
    currentLevel = level;
  }

  function getCurrentLevel() {
    return currentLevel;
  }
  var service = {
    setCurrentLevel : setCurrentLevel,
    getCurrentLevel : getCurrentLevel
  };

  return service;
}
