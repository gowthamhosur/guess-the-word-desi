/**
 * Created by harsh on 4/13/2017.
 */
gameModule.factory('userGameData', userGameData);

function userGameData($cordovaNativeStorage,gameConstants) {
  var currentLevel = gameConstants.initialLevel, currentCoins = gameConstants.initialCoins;

  $cordovaNativeStorage.getItem("userData").then(function (value) {
  }, function (value) {
    $cordovaNativeStorage.setItem("userData", {currentLevel: currentLevel, currentCoins:currentCoins})
  });

  $cordovaNativeStorage.getItem("puzzleData").then(function (value) {
  },function (value) {
    $cordovaNativeStorage.setItem("puzzleData", {});
  });


  function setUserData(level,coins) {
    currentLevel = level;
    currentCoins = coins;
    $cordovaNativeStorage.setItem("userData", {currentCoins : currentCoins, currentLevel: currentLevel});
  }

  function getUserData() {
     return $cordovaNativeStorage.getItem("userData");
  }

  function setCachedPuzzleData( choosableLetters, selectedLetters, solution, currentLevel ) {
    var setData = {
      choosableLetters: choosableLetters,
      selectedLetters: selectedLetters,
      solution: solution,
      currentLevel: currentLevel
    }
    $cordovaNativeStorage.setItem("puzzleData", setData);
  }

  function getCachedPuzzleData() {
    return $cordovaNativeStorage.getItem("puzzleData");
  }

  var service = {
    setUserData: setUserData,
    getUserData: getUserData,
    setCachedPuzzleData: setCachedPuzzleData,
    getCachedPuzzleData: getCachedPuzzleData
  };

  return service;
}
