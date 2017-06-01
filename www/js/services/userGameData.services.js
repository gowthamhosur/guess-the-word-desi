gameModule.factory('userGameData', userGameData);

function userGameData($ionicPlatform, $cordovaNativeStorage,gameConstants) {
  var currentLevel = gameConstants.initialLevel,
      currentCoins = gameConstants.initialCoins,
      currentLanguage = gameConstants.initialLanguage;

  $ionicPlatform.ready(function(){
    $cordovaNativeStorage.getItem("userData").then(function (value) {
    }, function (value) {
      $cordovaNativeStorage.setItem("userData", {currentLevel: currentLevel, currentCoins:currentCoins})
    });

    $cordovaNativeStorage.getItem("puzzleData").then(function (value) {
    },function (value) {
      $cordovaNativeStorage.setItem("puzzleData", {});
    });

     $cordovaNativeStorage.getItem("language").then(function (value) {
    },function (value) {
      $cordovaNativeStorage.setItem("language", currentLanguage);
    });
  })

  setUserData = function (level,coins) {
    $cordovaNativeStorage.setItem("userData", {currentCoins : coins, currentLevel: level});
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

  setLanguage = function(language) {
    $cordovaNativeStorage.setItem("language", language);
  }

  getLanguage = function(){
    return $cordovaNativeStorage.getItem("language");
  }

  resetPuzzleData = function() {
    return $cordovaNativeStorage.setItem("puzzleData", {});
  }

  var service = {
    setUserData: setUserData,
    getUserData: getUserData,
    setCachedPuzzleData: setCachedPuzzleData,
    getCachedPuzzleData: getCachedPuzzleData,
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    resetPuzzleData: resetPuzzleData
  };

  return service;
}
