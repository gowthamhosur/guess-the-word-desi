'use strict';

gameModule.controller('gameController', gameController);
gameController.$inject = ['$scope', '$state', 'gameService', 'userGameData', 'gameConstants', '$ionicPopup', '$timeout', '$q', 'AdMob'];

function gameController($scope, $state, gameService, userGameData, gameConstants, $ionicPopup, $timeout, $q, AdMob) {
  var vm = this;

  vm.onChoosableClick = onChoosableClick;
  vm.onSelectedClick = onSelectedClick;
  vm.onHelpClick = onHelpClick;
  vm.onSkipClick = onSkipClick;
  vm.animateCoins = animateCoins;

  var emptyLetter = " ";

  loadInitData().then(function(arrayOfResults){

    var userData = arrayOfResults[0],
        languageData = arrayOfResults[1],
        cachedPuzzleData = arrayOfResults[2],
        puzzleData = arrayOfResults[3];

    vm.currentLevel = userData.currentLevel;
    vm.currentCoins = userData.currentCoins;  
    vm.currentLanguage = languageData;   
    vm.cachedPuzzleData = cachedPuzzleData;
    vm.puzzleData = {
           solutions: puzzleData[0].data[vm.currentLanguage],
           letterBucket: puzzleData[1].data[vm.currentLanguage]
    };

    loadCurrentlevel();

  })


  function loadInitData () {
      return  $q.all( [ userGameData.getUserData() , 
                         userGameData.getLanguage() , 
                         userGameData.getCachedPuzzleData() , 
                         gameService.getPuzzleData() ])

  }


  $scope.$watch(function () {
    return vm.currentLevel;
  },function(){

    if (vm.currentLevel > gameConstants.totalLevels) {
      return $state.transitionTo('success', null, {reload: true, notify:true});
    }

    if(vm.currentLevel){
      vm.puzzleImages = gameService.getPuzzleImages( vm.currentLevel );
      loadCurrentlevel();
    }
  });

  function loadCurrentlevel(){
    if(vm.puzzleData){
      if( vm.cachedPuzzleData.currentLevel != vm.currentLevel ){ //If cached data is outdated
        vm.solution  = getSolutionLetters( vm.puzzleData["solutions"][vm.currentLevel] );
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

  function getSolutionLetters( cryptedSolution) {
    var decryptedSolution = CryptoJS.AES.decrypt(cryptedSolution, "neroachilles").toString(CryptoJS.enc.Utf8);
    return graphemeSplitter.splitGraphemes(decryptedSolution) ;
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
      userGameData.setUserData(vm.currentLevel + 1, vm.currentCoins + gameConstants.levelCoins, vm.currentLanguage);
      showLevelSucccess(vm.currentLevel);
    } else
    {
      vm.allSelected = allSelectedFlag;
    }
  }

  function showLevelSucccess(level) {
     var alertPopup = $ionicPopup.alert({
       cssClass: 'level-success-popup',
       templateUrl: 'templates/popup/levelSuccess.html',
       scope: $scope,
       okText: ' '
     });

   if( level % gameConstants.adsOnEveryNthLevel === 0 ) {
    $timeout(function(){
      userGameData.getShowAds().then(function(showAds){
        if(showAds) {
          AdMob.showInterstitial()
        }
      })
    }, 700);
   }   
    

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

      var onConfirm = function() {
        revealLetter();
      }

      confirmPopup(onConfirm, 'Reveal a letter for ' + gameConstants.helpCoins + ' coins?');

    } else {
      alertPopup("Insufficient coins");
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

        userGameData.getUserData().then(function (value) {
           vm.currentCoins = value.currentCoins;
           checkLevelSuccess();
         });


      } else {
        revealLetter();
      }

  };

  function onSkipClick() {
    if(vm.currentCoins > gameConstants.skipCoins) {

      var onConfirm = function() {
           skipLevel();
           userGameData.getUserData().then(function (value) {
              vm.currentLevel = value.currentLevel;
              vm.currentCoins = value.currentCoins;
            });
         }

      confirmPopup(onConfirm, 'Skip a level for ' + gameConstants.skipCoins + ' coins?')

    } else {
      alertPopup("Insufficient coins");
    }
  }

  function skipLevel() {
      userGameData.setUserData(vm.currentLevel + 1, vm.currentCoins - gameConstants.skipCoins, vm.currentLanguage)
      vm.allSelected = false;
      vm.currentLevel++;
  }

  function confirmPopup(onConfirm, popupText) {

    $scope.popupText = popupText;

    var confirmPopup = $ionicPopup.confirm({
         title: 'Confirmation',
         cssClass: 'primary-popup',
         templateUrl: 'templates/popup/confirmation.html',
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

  function alertPopup(alertText) {

    $scope.popupText = alertText;

    var alertPopup = $ionicPopup.alert({
       cssClass: 'primary-popup alert',
       templateUrl: 'templates/popup/confirmation.html',
       okText: 'Ok',
       scope: $scope
     });

    $scope.closeConfirm = function(){
        alertPopup.close();
    }
  }

  function animateCoins() {
      var easingFn = function (t, b, c, d) {
      var ts = (t /= d) * t;
      var tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    }
    var options = {
      useEasing : true, 
      easingFn: easingFn, 
      useGrouping : true, 
      separator : ',', 
      decimal : '.', 
    };
    var count = new CountUp("coins", vm.currentCoins, vm.currentCoins + gameConstants.levelCoins , 0, 1, options);
    $timeout(function() {
      count.start();
    }, 400);
  }

}



