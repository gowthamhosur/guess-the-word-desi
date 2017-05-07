/**
 * Created by harsh on 4/13/2017.
 */
gameModule.factory('userGameData', userGameData);

function userGameData($cordovaNativeStorage,gameConstants) {
  var currentLevel = gameConstants.initialLevel, currentCoins = gameConstants.initialCoins;

  $cordovaNativeStorage.getItem("userData").then(function (value) {
  }, function (value) {
    $cordovaNativeStorage.setItem("userData", {currentLevel: gameConstants.initialLevel, currentCoins: gameConstants.initialCoins})
  });

  $cordovaNativeStorage.getItem("puzzleData").then(function (value) {
  },function (value) {
    $cordovaNativeStorage.setItem("puzzleData", {});
  });


  function setUserData() {
    $cordovaNativeStorage.setItem("userData", {currentCoins : currentCoins, currentLevel: currentLevel});
  }

  function setCurrentLevel(level) {
    currentLevel = level;
    setUserData();
  }
  function getCurrentLevel() {
     return $cordovaNativeStorage.getItem("userData");
  }

  function setCurrentCoins(coins) {
    currentCoins = coins;
    setUserData();
  }

  function getCurrentCoins() {
    return $cordovaNativeStorage.getItem("userData");
  }

  function setCachedPuzzleData( choosableLetters, selectedLetters, solution, currentLevel ) {
    $cordovaNativeStorage.setItem("puzzleData.choosableLetters", "choosableLetters");
    $cordovaNativeStorage.setItem("puzzleData.selectedLetters", "selectedLetters");

    if(solution)
      $cordovaNativeStorage.setItem("puzzleData.solution", "solution");
    if(currentLevel)
      $cordovaNativeStorage.setItem("puzzleData.currentLevel", "currentLevel");
  }

  function getCachedPuzzleData() {
    return $cordovaNativeStorage.getItem("puzzleData");
  }

  var service = {
    setCurrentLevel : setCurrentLevel,
    getCurrentLevel : getCurrentLevel,
    setCurrentCoins : setCurrentCoins,
    getCurrentCoins : getCurrentCoins,
    setCachedPuzzleData: setCachedPuzzleData,
    getCachedPuzzleData: getCachedPuzzleData
  };

  return service;
}
