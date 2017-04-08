'use strict';

gameModule.controller('gameController', ['$scope', function($scope) {

  $scope.gameConstants = {
  	initialLevel: 0,
  	numberOfPics: 4,
  	maxSelectedLetters: 9,
  	maxChoosableLetters: 18,
  	totalGameLevels: 50
  }

  $scope.level = 10;

  
}]);