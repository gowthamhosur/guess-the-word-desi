'use strict';

gameModule.controller('gameController', gameController);
gameController.$inject = ['$scope', '$state', 'gameService', 'userGameData', 'gameConstants', '$ionicPopup', '$timeout'];

function gameController($scope, $state, gameService, userGameData, gameConstants, $ionicPopup, $timeout) {
  var vm = this;

  vm.onChoosableClick = onChoosableClick;
  vm.onSelectedClick = onSelectedClick;
  vm.onHelpClick = onHelpClick;
  vm.onSkipClick = onSkipClick;

  var emptyLetter = " ";

  userGameData.getUserData().then(function (value) {
    vm.currentLevel = value.currentLevel;
    vm.currentCoins = value.currentCoins;
  });

  userGameData.getCachedPuzzleData().then(function (value) {
    vm.cachedPuzzleData = value;
    gameService.getPuzzleData()
      .then(function(arrayOfResults){
         vm.puzzleData = {
           solutions: arrayOfResults[0].data[gameConstants.language],
           letterBucket: arrayOfResults[1].data[gameConstants.language]
         };
         loadCurrentlevel();
       })
       .catch(function (err) {
         console.log(err, "Error while retrieving App Data")
       });

  });

  $scope.$watch(function () {
    return vm.currentLevel;
  },function(){

    if (vm.currentLevel > gameConstants.totalLevels) {
      return $state.transitionTo('success', null, {reload: true, notify:true});
    }

    vm.puzzleImages = gameService.getPuzzleImages( vm.currentLevel );
    loadCurrentlevel();
  });

  function loadCurrentlevel(){
    if(vm.puzzleData){
      if( vm.cachedPuzzleData.currentLevel != vm.currentLevel ){ //If cached data is outdated
        vm.solution  = graphemeSplitter.splitGraphemes( vm.puzzleData["solutions"][vm.currentLevel] );
        vm.choosableLetters = getChoosableLetters( vm.puzzleData["letterBucket"], vm.solution );
        vm.selectedLetters = wrapLetters( vm.solution.map(function() { return emptyLetter }) );

        userGameData.setCachedPuzzleData( vm.choosableLetters, vm.selectedLetters, vm.solution, vm.currentLevel);
      }
      else{
        vm.solution  = vm.cachedPuzzleData.solution;
        vm.choosableLetters = vm.cachedPuzzleData.choosableLetters;
        vm.selectedLetters = vm.cachedPuzzleData.selectedLetters;
      }
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
      userGameData.setUserData(vm.currentLevel + 1, vm.currentCoins + gameConstants.levelCoins);
      showLevelSucccess();
    } else
    {
      vm.allSelected = allSelectedFlag;
    }
  }

   function showLevelSucccess() {
     var alertPopup = $ionicPopup.alert({
       cssClass: 'level-success-popup',
       templateUrl: 'templates/levelSuccess.html',
       scope: $scope,
       okText: ' '
     });

     console.log(vm.solution)

     $scope.onContinueClick = function(button,$event){
        $timeout(function(){
          alertPopup.close();
           userGameData.getUserData().then(function (value) {
              vm.currentLevel = value.currentLevel;
              vm.currentCoins = value.currentCoins;
            });
         }, 300);
     }
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
      userGameData.setCachedPuzzleData( vm.choosableLetters, vm.selectedLetters, vm.solution, vm.currentLevel);
      checkLevelSuccess();
    }
  }

  function onSelectedClick(index){
    if(!vm.selectedLetters[index].affixed){
      var hostIndex = vm.selectedLetters[index].hostIndex;
      vm.selectedLetters[index].letter = emptyLetter;
      vm.choosableLetters[hostIndex].active = true;
      vm.allSelected = false;
      userGameData.setCachedPuzzleData( vm.choosableLetters, vm.selectedLetters, vm.solution, vm.currentLevel);
    }
  }

 function onHelpClick() {
    if(vm.currentCoins > gameConstants.helpCoins) {

      $scope.popupText = 'Reveal a letter for ' + gameConstants.helpCoins + ' coins?';

      var onConfirm = function() {
        revealLetter();
        userGameData.getUserData().then(function (value) {
            vm.currentLevel = value.currentLevel;
            vm.currentCoins = value.currentCoins;
          });
      }

      initConfirmPopup(onConfirm);

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

        userGameData.setUserData(vm.currentLevel, vm.currentCoins-gameConstants.helpCoins);
        userGameData.setCachedPuzzleData( vm.choosableLetters, vm.selectedLetters, vm.solution, vm.currentLevel);

        checkLevelSuccess();

      } else {
        revealLetter();
      }

  };

  function onSkipClick() {
    if(vm.currentCoins > gameConstants.skipCoins) {

      $scope.popupText = 'Skip a level for ' + gameConstants.skipCoins + ' coins?';

      var onConfirm = function() {
           skipLevel();
           userGameData.getUserData().then(function (value) {
              vm.currentLevel = value.currentLevel;
              vm.currentCoins = value.currentCoins;
            });
         }

      initConfirmPopup(onConfirm)

    } else {
      alert("Insufficient coins");
    }
  }

  function skipLevel() {
      userGameData.setUserData(vm.currentLevel + 1, vm.currentCoins - gameConstants.skipCoins)
      vm.allSelected = false;
      vm.currentLevel++;
  }

  function initConfirmPopup(onConfirm) {

    var confirmPopup = $ionicPopup.confirm({
         title: 'Confirmation',
         cssClass: 'confirmation-popup',
         templateUrl: 'templates/confirmation.html',
         scope: $scope
       });

    $scope.closeConfirm = function(){
        confirmPopup.close();
    }
    
    confirmPopup.then(function(res){
      if(res) {
        onConfirm()
      }
      else {
        return;
      }
    });

  }

}



