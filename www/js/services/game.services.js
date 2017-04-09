'use strict';

gameModule.service('gameService', ['$http', function($http){

	this.getPuzzleImages = function(currentLevel,numberOfPics) {
		var rootFileName = "lvl" + currentLevel,
  		puzzleImages = [];

  		for (var i = 1; i <= numberOfPics; i++) {
  			puzzleImages.push(rootFileName + '-' + i);
  		}
  		return puzzleImages;
	}

	this.getUserData = function(){
		return $http.get('appdata/userData.json');
	}

	this.getPuzzleData = function(){
		return $http.get('appdata/puzzleData.json');
	}

}]);