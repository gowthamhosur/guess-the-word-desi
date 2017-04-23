'use strict';

gameModule.controller('gameController', gameController);
gameController.$inject = ['$scope', '$state', 'gameService', 'userGameData', 'gameConstants', '$ionicPopup'];

function gameController($scope, $state, gameService, userGameData, gameConstants, $ionicPopup) {
  var vm = this;

  vm.loadCurrentlevel = loadCurrentlevel;
  vm.onChoosableClick = onChoosableClick;
  vm.checkLevelSuccess = checkLevelSuccess;
  vm.onSelectedClick = onSelectedClick;
  vm.onHelpClick = onHelpClick;
  vm.wrapLetters = wrapLetters;

  vm.currentLevel =  userGameData.getCurrentLevel();
  vm.currentCoins = userGameData.getCurrentCoins();

  var helpArrayIndex = [];

  if(!vm.currentLevel){
    return $state.transitionTo('home', null, {reload: true, notify:true});
  } 

  gameService.getPuzzleData()
  .then(function(arrayOfResults){
    vm.puzzleData = {
      solutions: arrayOfResults[0].data[gameConstants.language],
      letterBucket: arrayOfResults[1].data[gameConstants.language]
    };

    vm.loadCurrentlevel();
  })
  .catch(function (err) {
    console.log(err, "Error while retrieving App Data")
  });

  $scope.$watch(function () {
    return vm.currentLevel;
  },function(){

    if (vm.currentLevel > gameConstants.totalLevels) {
    return $state.transitionTo('success', null, {reload: true, notify:true});
    }

    vm.puzzleImages = gameService.getPuzzleImages( vm.currentLevel, gameConstants.numberOfPics );
    vm.loadCurrentlevel();
  });


  function onHelpClick() {
    if(vm.currentCoins > 160) {

      var helpIndex = Math.floor(Math.random() * vm.selectedLetters.length);

      if(!(vm.selectedLetters[helpIndex].letter == vm.helpArray[helpIndex])) {

        while (helpArrayIndex.includes(helpIndex)) {
          helpIndex = Math.floor(Math.random() * vm.selectedLetters.length);
        }
        helpArrayIndex.push(helpIndex);
        vm.selectedLetters[helpIndex].letter = vm.helpArray[helpIndex];
        vm.currentCoins -= 160;
        userGameData.setCurrentCoins(vm.currentCoins);
        vm.checkLevelSuccess();

      } else {
        console.log("Coming into recursive help");
        vm.onHelpClick();
      }

    } else {
      alert('You are a poor nigga');
    }
  }

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
    console.log(hostIndex);
    console.log(vm.selectedLetters);
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
      vm.currentCoins += 50;
      userGameData.setCurrentCoins(vm.currentCoins);
      helpArrayIndex = [];
      console.log("Congrats!");
      vm.currentLevel = vm.currentLevel + 1;
    }
  }

  function loadCurrentlevel(){
    if(vm.puzzleData){

      vm.solution  = graphemeSplitter.splitGraphemes( vm.puzzleData["solutions"]["lvl" + vm.currentLevel] );
      vm.choosableLetters = getChoosableLetters( vm.puzzleData["letterBucket"], vm.solution );

      vm.helpArray = vm.solution.slice(0);
      vm.selectedLetters = vm.wrapLetters( vm.solution.map(function() { return "" }) );
    }
  }

  function getChoosableLetters(letterBucket, solutions) {
    var filteredBucket = gameService.filterLetterBucket(letterBucket, gameConstants.maxChoosableLetters - solutions.length);
    var choosableLetters = gameService.shuffle( filteredBucket.concat(solutions) );
    return wrapLetters(choosableLetters);
  }

  // Returns an object of array elements
  function wrapLetters(letters) {
    return letters.map(
      function(element){
        var temp = {
          active: true,
          letter: element
        };
        return temp;
      });
  }

}



