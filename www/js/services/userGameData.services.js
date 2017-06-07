gameModule.factory('userGameData', userGameData);

function userGameData($ionicPlatform, $cordovaNativeStorage,gameConstants) {
  
  $ionicPlatform.ready(function(){
    $cordovaNativeStorage.getItem("userData").then(function (value) {
    }, function (value) {
      $cordovaNativeStorage.setItem("userData", {currentLevel: gameConstants.initialLevel, currentCoins:gameConstants.initialCoins})
    });

    $cordovaNativeStorage.getItem("puzzleData").then(function (value) {
    },function (value) {
      $cordovaNativeStorage.setItem("puzzleData", {});
    });

     $cordovaNativeStorage.getItem("language").then(function (value) {
    },function (value) {
      $cordovaNativeStorage.setItem("language", gameConstants.initialLanguage);
    });

     $cordovaNativeStorage.getItem("levelProgress").then(function (value) {
    },function (value) {
      $cordovaNativeStorage.setItem("levelProgress", 
      {
        "english" : gameConstants.initialLevel,
        "telugu" : gameConstants.initialLevel,
        "hindi" : gameConstants.initialLevel,
        "kannada": gameConstants.initialLevel
      });
      //TODO: Get languages dynamicaclly from copy.json
    });

     $cordovaNativeStorage.getItem("showAds").then(function (value) {
    },function (value) {
      $cordovaNativeStorage.setItem("showAds", true);
    });     

  });

  setUserData = function (level,coins,language) {
    if( coins == undefined) {
      $cordovaNativeStorage.getItem("userData").then(function(data){
        $cordovaNativeStorage.setItem("userData", {currentLevel: level, currentCoins : data.currentCoins});
      })
    }
    else {
      $cordovaNativeStorage.setItem("userData", {currentLevel: level, currentCoins : coins});
    }

    if(language) {
      $cordovaNativeStorage.getItem("levelProgress").then(function(data){
        data[language] = level;
        $cordovaNativeStorage.setItem("levelProgress", data);
      })
    }

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

  resetCahcedPuzzleData = function() {
    return $cordovaNativeStorage.setItem("puzzleData", {});
  }

  setLanguage = function(language) {
    $cordovaNativeStorage.setItem("language", language);
  }

  getLanguage = function(){
    return $cordovaNativeStorage.getItem("language");
  }

  getLevelProgress = function(){
    return $cordovaNativeStorage.getItem("levelProgress");
  }

  getShowAds = function(){
    return $cordovaNativeStorage.getItem("showAds");
  }

  setShowAds = function(value) {
    $cordovaNativeStorage.setItem("showAds", value);
  }

  var service = {
    setUserData: setUserData,
    getUserData: getUserData,
    setCachedPuzzleData: setCachedPuzzleData,
    getCachedPuzzleData: getCachedPuzzleData,
    resetCahcedPuzzleData: resetCahcedPuzzleData,
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    getLevelProgress: getLevelProgress,
    getShowAds: getShowAds,
    setShowAds: setShowAds
  };

  return service;
}
