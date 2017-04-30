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
  vm.onSkipClick = onSkipClick;

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
    if(vm.currentCoins > 80) {

      var helpIndex = Math.floor(Math.random() * vm.selectedLetters.length);
      var notfoundFlag = false;

      if(!(vm.selectedLetters[helpIndex].letter == vm.solution[helpIndex])) {

        if(vm.selectedLetters[helpIndex].letter != ""){
          //Send the already present selected letter back to choosable letter
          onSelectedClick(helpIndex);
        }

        //Set the help letter in selected letters
        vm.selectedLetters[helpIndex].letter = vm.solution[helpIndex];
        vm.selectedLetters[helpIndex].affixed = true;

        //Hide the help letter in choosable letters
        for (var i = 0; i < vm.choosableLetters.length; i++) {
          if(vm.choosableLetters[i].letter == vm.solution[helpIndex]){
            vm.choosableLetters[i].active = false;
            notfoundFlag = true;
            break;
          }
        }
         //If help letter is not found in choosable letters, search in selected letters
        if(notfoundFlag) {
          for (var i = 0; i < vm.selectedLetters.length; i++) {
              if(vm.selectedLetters[i].letter == vm.solution[helpIndex] && i != helpIndex){
                vm.selectedLetters[i].letter = "";
                break;
              }
          }
        }

        vm.currentCoins -= 80;
        userGameData.setCurrentCoins(vm.currentCoins);

        vm.checkLevelSuccess();

      } else {
        vm.onHelpClick();
      }

    } else {
      alert('You are a poor nooka');
    }
  }

  function onSkipClick() {
    if(vm.currentCoins > 180) {
      vm.currentCoins -= 180;
      userGameData.setCurrentCoins(vm.currentCoins);
      userGameData.setCurrentLevel(vm.currentLevel + 1);
      vm.allSelected = false;
      vm.currentLevel++;
    } else {
      alert("Insufficient credits");
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
    if(!vm.selectedLetters[index].affixed){
      var hostIndex = vm.selectedLetters[index].hostIndex;
      vm.selectedLetters[index].letter = "";
      vm.choosableLetters[hostIndex].active = true;
      vm.allSelected = false;
    }
  }

  function checkLevelSuccess() {
    var successFlag = true, allSelectedFlag = true;
    vm.solution.forEach(function(value,index){
      if(value != vm.selectedLetters[index].letter)
        successFlag = false;
      if(vm.selectedLetters[index].letter == "")
        allSelectedFlag = false;
    });

    if(successFlag) {
      vm.currentCoins += 50;
      userGameData.setCurrentCoins(vm.currentCoins);
      userGameData.setCurrentLevel(vm.currentLevel + 1);
      showAlert();
    } else
    {
      vm.allSelected = allSelectedFlag;
    }
  }

  function loadCurrentlevel(){
    if(vm.puzzleData){

      vm.solution  = graphemeSplitter.splitGraphemes( vm.puzzleData["solutions"]["lvl" + vm.currentLevel] );
      vm.choosableLetters = getChoosableLetters( vm.puzzleData["letterBucket"], vm.solution );

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

  function showAlert() {
   var alertPopup = $ionicPopup.alert({
     title: 'Bravo',
     template: 'Nuvvu keka'
   });

   alertPopup.then(function(res) {
      vm.currentLevel =  userGameData.getCurrentLevel();
   });
 };

}



