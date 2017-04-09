'use strict';

gameModule.controller('gameController', ['$scope','gameService', function($scope, gameService) {

  $scope.gameConstants = {
  	initialLevel: 0,
  	numberOfPics: 4,
  	maxSelectedLetters: 9,
  	maxChoosableLetters: 18,
  	totalGameLevels: 50
  }

  gameService.getAppData()
    .success(function(data){
      $scope.appData = data
    })
    .error(function(err){
      console.log(err, "Error while retrieving App Data")
    })

  $scope.currentLevel = 10;
  $scope.puzzleImages = gameService.getPuzzleImages( $scope.currentLevel, $scope.gameConstants.numberOfPics );
  $scope.choosableLetters = $scope.appData? $scope.appData["lvl" + $scope.currentLevel].choosableLetters: [];

}]);
