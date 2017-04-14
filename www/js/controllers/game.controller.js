'use strict';

gameModule.controller('gameController', gameController);
gameController.$inject = ['$scope','gameService', 'userGameData', 'initialLevel', 'numberOfPics'];

function gameController($scope, gameService, userGameData, initialLevel, numberOfPics) {
  var vm = this;
  vm.setLevelData = setLevelData;
  vm.onChoosableClick = onChoosableClick;
  vm.checkLevelSuccess = checkLevelSuccess;
  vm.onSelectedClick = onSelectedClick;
  vm.wrapLetters = wrapLetters;
  vm.currentLevel =  userGameData.getCurrentLevel();

  gameService.getPuzzleData()
             .success(function(data){
                vm.puzzleData = data;
                vm.setLevelData(vm.puzzleData);
              })
             .error(function(err){
                console.log(err, "Error while retrieving App Data")
              });

  $scope.$watch(function () {
    return vm.currentLevel;
  },function(){
    vm.puzzleImages = gameService.getPuzzleImages( vm.currentLevel, numberOfPics );
    vm.setLevelData( vm.puzzleData );
  });

   function onChoosableClick(index) {
    if(vm.choosableLetters[index].active){
      for (var i = 0; i < vm.selectedLetters.length; i++) {
        if(vm.selectedLetters[i].letter == ""){
          vm.selectedLetters[i].letter  = vm.choosableLetters[index].letter;
          vm.selectedLetters[i].hostIndex = index;
          vm.choosableLetters[index].active = false;
          break;
        }
      }
      vm.checkLevelSuccess();
    }
  }

  function onSelectedClick(index){
    var hostIndex = vm.selectedLetters[index].hostIndex;
    vm.selectedLetters[index].letter = "";
    vm.choosableLetters[hostIndex].active = true;
  }

  function checkLevelSuccess() {
    var successFlag = true;
    vm.solution.forEach(function(value,index){
      if(value != vm.selectedLetters[index].letter)
        successFlag = false;
    });
    if(successFlag) {
      console.log("Congrats!");
        vm.currentLevel = vm.currentLevel + 1;
    }
  }

  function setLevelData( puzzleData ){
    if( puzzleData ) {
      vm.choosableLetters = vm.wrapLetters( gameService.shuffle( puzzleData["lvl" + vm.currentLevel].choosableLetters ) );
      vm.solution = puzzleData["lvl" + vm.currentLevel].solution;
      vm.selectedLetters = vm.wrapLetters( vm.solution.map(function() { return "" }) );
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



