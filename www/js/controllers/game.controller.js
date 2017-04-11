'use strict';

gameModule.controller('gameController', gameController);
gameController.$inject = ['$scope','gameService'];

function gameController($scope, gameService) {
  
  gameService.getPuzzleData()
             .success(function(data){
                $scope.puzzleData = data;
                setLevelData( $scope.puzzleData , $scope);
              })
             .error(function(err){
                console.log(err, "Error while retrieving App Data")
              });

  $scope.$watch('currentLevel',function(){
    $scope.puzzleImages = gameService.getPuzzleImages( $scope.currentLevel, $scope.gameConstants.numberOfPics );
    setLevelData( $scope.puzzleData );
  });

  $scope.onChoosableClick = function(index) {
    if($scope.choosableLetters[index].active){
      for (var i = 0; i < $scope.selectedLetters.length; i++) {
        if($scope.selectedLetters[i].letter == ""){
          $scope.selectedLetters[i].letter  = $scope.choosableLetters[index].letter;
          $scope.selectedLetters[i].hostIndex = index;
          $scope.choosableLetters[index].active = false;
          break;
        }
      }
      checkLevelSuccess($scope);
    }
  }

  $scope.onSelectedClick = function(index){
    var hostIndex = $scope.selectedLetters[index].hostIndex;
    $scope.selectedLetters[index].letter = "";
    $scope.choosableLetters[hostIndex].active = true;
  }

  function checkLevelSuccess() {
    var successFlag = true;
    $scope.solution.forEach(function(value,index){
      if(value != $scope.selectedLetters[index].letter)
        successFlag = false;
    });
    if(successFlag) {
      console.log("Congrats!");
        $scope.currentLevel = $scope.currentLevel + 1;
    }
  }

  function setLevelData( puzzleData ){
    if( puzzleData ) {
      $scope.choosableLetters = wrapLetters( gameService.shuffle( puzzleData["lvl" + $scope.currentLevel].choosableLetters ) );
      $scope.solution = puzzleData["lvl" + $scope.currentLevel].solution; 
      $scope.selectedLetters = wrapLetters( $scope.solution.map(function() { return "" }) );
    }
  }

  // Returns an object of array elements
  function wrapLetters(letters) {
    return letters.map(
      function(element){
        var temp = {
        active: true,
        letter: element
        }
        return temp;
      });
  }

};



