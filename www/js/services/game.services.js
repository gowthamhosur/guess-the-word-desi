'use strict';

gameModule.factory('gameService', gameService);

gameService.$inject = ['$http', '$q', '$localStorage', 'userGameData'];

function gameService($http, $q, $localStorage, userGameData){

  if(!$localStorage.userData) {
    $localStorage.userData = {currentLevel: 10, currentCoins: 400};
  }

	function getUserData(){
		return $localStorage.userData;
	}

	function setUserData() {
		$localStorage.userData.currentCoins = userGameData.getCurrentCoins();
	    $localStorage.userData.currentLevel = userGameData.getCurrentLevel();
  }

	function getPuzzleData(){
		var solutions = $http.get('appdata/solutions.json'),
		letterBucket = $http.get('appdata/letterBucket.json');

		return $q.all([solutions,letterBucket]);
	}

	function getPuzzleImages(currentLevel,numberOfPics) {
		var rootFileName = "lvl" + currentLevel,
		puzzleImages = [];

		for (var i = 1; i <= numberOfPics; i++) {
			puzzleImages.push(rootFileName + '-' + i);
		}
		return puzzleImages;
	}

	function filterLetterBucket(letterBucket, count) {
		var tmp = letterBucket.slice(letterBucket);
		var ret = [];

		for (var i = 0; i < count; i++) {
			var index = Math.floor(Math.random() * tmp.length);
			var removed = tmp.splice(index, 1);
    		ret.push(removed[0]);
		}
		return ret;
	}


	function shuffle(array){
		var j, x, i;
		for (i = array.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = array[i - 1];
			array[i - 1] = array[j];
			array[j] = x;
		}
		return array;
	}

	var service = {
	getUserData : getUserData,
    setUserData: setUserData,
    getPuzzleData: getPuzzleData,
    getPuzzleImages: getPuzzleImages,
    filterLetterBucket: filterLetterBucket,
    shuffle: shuffle
  };

  return service;

}
