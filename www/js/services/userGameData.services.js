gameModule.factory('userGameData', userGameData);

function userGameData($ionicPlatform, $cordovaNativeStorage,gameConstants) {

  //ngStorage items
  var USER_DATA = "userData",
      PUZZLE_DATA = "puzzleData",
      LANGUAGE = "language",
      LEVEL_PROGRESS = "levelProgress",
      SHOW_ADS = "showAds";

  //Initial Data on first run
  var initialUserData = { currentLevel: gameConstants.initialLevel, currentCoins: gameConstants.initialCoins},
      initialLevelProgress = {
        "english" : gameConstants.initialLevel,
        "telugu" : gameConstants.initialLevel,
        "hindi" : gameConstants.initialLevel,
        "kannada": gameConstants.initialLevel
  }

  //Creating app data on first run
  $ionicPlatform.ready(function(){
    createInitialData(USER_DATA, initialUserData);
    createInitialData(PUZZLE_DATA, {});
    createInitialData(LANGUAGE, gameConstants.initialLanguage);
    createInitialData(LEVEL_PROGRESS, initialLevelProgress);
    createInitialData(SHOW_ADS, true); 
  });

  function createInitialData(key, initialValue) {
    $cordovaNativeStorage.getItem(key).then(function (value) {
    }, function (value) {
      $cordovaNativeStorage.setItem(key, initialValue)
    });
  }

  function getStorageItem(item) {
    return $cordovaNativeStorage.getItem(item);
  }
  function setStorageItem(item, value) {
    return $cordovaNativeStorage.setItem(item, value);
  }


  function getUserData() {
    return getStorageItem(USER_DATA);
  }
  function getLanguage() {
    return getStorageItem(LANGUAGE);
  }
  function getLevelProgress() {
    return getStorageItem(LEVEL_PROGRESS);
  }
  function getShowAds() {
    return getStorageItem(SHOW_ADS);
  }
  function getCachedPuzzleData() {
    return getStorageItem(PUZZLE_DATA);
  }

  function setLanguage(value) {
    return setStorageItem(LANGUAGE,value);
  }
  function setShowAds(value) {
    return setStorageItem(SHOW_ADS,value); 
  }
  function setCachedPuzzleData( choosableLetters, selectedLetters, solution, currentLevel ) {
    var setData = {
      choosableLetters: choosableLetters,
      selectedLetters: selectedLetters,
      solution: solution,
      currentLevel: currentLevel
    }
    return setStorageItem(PUZZLE_DATA,setData); 
  }
  function setUserData(level,coins,language) {
    if( coins == undefined) {
      getUserData().then(function(data){
        setStorageItem(USER_DATA, {currentLevel: level, currentCoins : data.currentCoins})
      })
    }
    else {
      setStorageItem(USER_DATA, {currentLevel: level, currentCoins : coins})
    }

    if(language) {
      getLevelProgress().then(function(data){
        data[language] = level;
        setStorageItem(LEVEL_PROGRESS, data)
      })
    }

  }

  var service = {
    setUserData: setUserData,
    getUserData: getUserData,
    setCachedPuzzleData: setCachedPuzzleData,
    getCachedPuzzleData: getCachedPuzzleData,
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    getLevelProgress: getLevelProgress,
    getShowAds: getShowAds,
    setShowAds: setShowAds
  };

  return service;
}
