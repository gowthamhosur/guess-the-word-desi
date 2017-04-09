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

	this.getAppData = function(){
		return $http.get('appdata/key.json');
	}
	
}]);