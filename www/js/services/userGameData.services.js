gameModule.factory('userGameData', userGameData);

function userGameData($ionicPlatform, $cordovaNativeStorage,gameConstants) {
  var currentLevel = gameConstants.initialLevel, currentCoins = gameConstants.initialCoins;

  $ionicPlatform.ready(function(){
    $cordovaNativeStorage.getItem("userData").then(function (value) {
    }, function (value) {
      $cordovaNativeStorage.setItem("userData", {currentLevel: currentLevel, currentCoins:currentCoins})
    });

    $cordovaNativeStorage.getItem("puzzleData").then(function (value) {
    },function (value) {
      $cordovaNativeStorage.setItem("puzzleData", {});
    });
  })

  setUserData = function (level,coins) {
    currentLevel = level;
    currentCoins = coins;
    $cordovaNativeStorage.setItem("userData", {currentCoins : currentCoins, currentLevel: currentLevel});
  }

  getUserData = function() {
     return $cordovaNativeStorage.getItem("userData");
  }

  setCachedPuzzleData = function( choosableLetters, selectedLetters, solution, currentLevel ) {
    var setData = {
      choosableLetters: choosableLetters,
      selectedLetters: selectedLetters,
      solution: solution,
      currentLevel: currentLevel
    }
    $cordovaNativeStorage.setItem("puzzleData", setData);
  }

   getCachedPuzzleData = function() {
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
