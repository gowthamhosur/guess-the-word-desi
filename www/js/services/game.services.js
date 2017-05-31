'use strict';

gameModule.factory('gameService', gameService);

gameService.$inject = ['$http', '$q', 'userGameData', 'gameConstants'];

function gameService($http, $q, userGameData, gameConstants){


	function getPuzzleData(){
		var solutions = $http.get('appdata/solutions.json'),
		letterBucket = $http.get('appdata/letterBucket.json');

		return $q.all([solutions,letterBucket]);
	}

	function getPuzzleImages(currentLevel) {
		var puzzleImages = gameConstants.imageSet;

		return puzzleImages.map(function(src){
			return currentLevel + '/' + src
		})

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

	function getCopy(){
		return $http.get('appdata/copy.json');
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
    getPuzzleData: getPuzzleData,
    getPuzzleImages: getPuzzleImages,
    filterLetterBucket: filterLetterBucket,
    shuffle: shuffle,
    getCopy: getCopy
  };

  return service;

}
