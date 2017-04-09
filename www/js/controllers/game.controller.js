'use strict';

gameModule.controller('gameController', ['$scope','gameService', function($scope, gameService) {

  $scope.gameConstants = {
  	initialLevel: 0,
  	numberOfPics: 4,
  	maxSelectedLetters: 9,
  	maxChoosableLetters: 18,
  	totalGameLevels: 50
  }

  $scope.currentLevel = 10;

  $scope.puzzleImages = gameService.getPuzzleImages( $scope.currentLevel,$scope.gameConstants.numberOfPics);

}]);