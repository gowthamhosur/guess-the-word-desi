/**
 * Created by harsh on 4/13/2017.
 */
gameModule.factory('userGameData', userGameData);

function userGameData($localStorage) {

  if(!$localStorage.userData) {
    $localStorage.userData = {currentLevel: 0, currentCoins: 400};
  }

  var currentLevel = $localStorage.userData.currentLevel;
  var currentCoins = $localStorage.userData.currentCoins;

  function setUserData() {
    $localStorage.userData.currentCoins = currentCoins;
    $localStorage.userData.currentLevel = currentLevel;
  }

  function setCurrentLevel(level) {
    currentLevel = level;
    setUserData();
  }
  function getCurrentLevel() {
    currentLevel = $localStorage.userData.currentLevel;
    return currentLevel;
  }
  function setCurrentCoins(coins) {
    currentCoins = coins;
    setUserData();
  }
  function getCurrentCoins() {
    currentCoins = $localStorage.userData.currentCoins;
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
