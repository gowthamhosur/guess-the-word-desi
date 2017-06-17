'use strict';

gameModule.factory('gameService', gameService);

gameService.$inject = ['$http', '$q', 'userGameData', 'gameConstants', '$window', '$timeout'];

function gameService($http, $q, userGameData, gameConstants, $window, $timeout){


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

	function setInitialRun (initial) {
	    $window.localStorage["initialRun"] = (initial ? "true" : "false");
	}
	 
	function isInitialRun() {
	    var value = $window.localStorage["initialRun"] || "true";
	    return value == "true";
	}

	function setVersion (version) {
	    $window.localStorage["appVersion"] = version;
	}
	 
	function getVersion() {
	    return $window.localStorage["appVersion"];
	}

	function clickEffect(element, callback) {
		angular.element(element).addClass("shrink");

		$timeout(function() {
				angular.element(element).removeClass("shrink");
				callback();
		}, 200);
	}

	var service = {
    getPuzzleData: getPuzzleData,
    getPuzzleImages: getPuzzleImages,
    filterLetterBucket: filterLetterBucket,
    shuffle: shuffle,
    getCopy: getCopy,
    setInitialRun: setInitialRun,
    isInitialRun: isInitialRun,
    setVersion: setVersion,
    getVersion: getVersion,
    clickEffect: clickEffect
  };

  return service;

}
