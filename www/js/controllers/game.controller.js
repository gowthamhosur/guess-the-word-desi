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

  var emptyLetter = " ";

  if(isNaN(vm.currentLevel)){
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

    vm.puzzleImages = gameService.getPuzzleImages( vm.currentLevel );
    vm.loadCurrentlevel();
  });

  function loadCurrentlevel(){
    if(vm.puzzleData){

      vm.solution  = graphemeSplitter.splitGraphemes( vm.puzzleData["solutions"][vm.currentLevel] );
      vm.choosableLetters = getChoosableLetters( vm.puzzleData["letterBucket"], vm.solution );

      vm.selectedLetters = vm.wrapLetters( vm.solution.map(function() { return emptyLetter }) );
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

  function checkLevelSuccess() {
    var successFlag = true, allSelectedFlag = true;
    vm.solution.forEach(function(value,index){
      if(value != vm.selectedLetters[index].letter)
        successFlag = false;
      if(vm.selectedLetters[index].letter == emptyLetter)
        allSelectedFlag = false;
    });

    if(successFlag) {
      userGameData.setCurrentCoins(vm.currentCoins + gameConstants.levelCoins);
      userGameData.setCurrentLevel(vm.currentLevel + 1);
      showLevelSucccess();
    } else
    {
      vm.allSelected = allSelectedFlag;
    }
  }

   function showLevelSucccess() {
     var alertPopup = $ionicPopup.alert({
       cssClass: 'level-success-popup',
       templateUrl: 'templates/levelSuccess.html'
     });

     alertPopup.then(function(res) {
        vm.currentLevel =  userGameData.getCurrentLevel();
        vm.currentCoins =  userGameData.getCurrentCoins();
     });
   };


  function onChoosableClick(index) {
    if(vm.choosableLetters[index].active){
      for (var i = 0; i < vm.selectedLetters.length; i++) {
        if(vm.selectedLetters[i].letter == emptyLetter){
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
      vm.selectedLetters[index].letter = emptyLetter;
      vm.choosableLetters[hostIndex].active = true;
      vm.allSelected = false;
    }
  }

 function onHelpClick() {
    if(vm.currentCoins > gameConstants.helpCoins) {
      
      $scope.popupText = 'Reveal a letter for 60 coins?';

      var confirmPopup = $ionicPopup.confirm({
         title: 'Confirmation',
         templateUrl: 'templates/confirmation.html',
         scope: $scope
       });

       confirmPopup.then(function(res) {
         if(res) {
           revealLetter();
         } else {
           return;
         }
       });
      

    } else {
      alert('Insufficient coins');
    }
  }


 function revealLetter() {
      var helpIndex = Math.floor(Math.random() * vm.selectedLetters.length);
      var notfoundFlag = false;

      if(!(vm.selectedLetters[helpIndex].letter == vm.solution[helpIndex])) {

        if(vm.selectedLetters[helpIndex].letter != emptyLetter){
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
                vm.selectedLetters[i].letter = emptyLetter;
                break;
              }
          }
        }

        vm.currentCoins -= gameConstants.helpCoins;
        userGameData.setCurrentCoins(vm.currentCoins);

        vm.checkLevelSuccess();

      } else {
        revealLetter();
      }

  };

  function onSkipClick() {
    if(vm.currentCoins > gameConstants.skipCoins) {

      $scope.popupText = 'Skip a level for 180 coins?';

      var confirmPopup = $ionicPopup.confirm({
         title: 'Confirmation',
         templateUrl: 'templates/confirmation.html',
         scope: $scope
       });

       confirmPopup.then(function(res) {
         if(res) {
           skipLevel();
         } else {
           return;
         }
       });
    } else {
      alert("Insufficient coins");
    }
  }

  function skipLevel() {
      vm.currentCoins -= gameConstants.skipCoins;
      userGameData.setCurrentCoins(vm.currentCoins);
      userGameData.setCurrentLevel(vm.currentLevel + 1);
      vm.allSelected = false;
      vm.currentLevel++;
  }

}



