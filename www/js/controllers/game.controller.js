'use strict';

gameModule.controller('gameController', gameController);
gameController.$inject = ['$scope', '$state', 'gameService', 'userGameData', 'gameConstants', '$ionicPopup', '$timeout', '$q', 'AdMob', '$ionicPlatform','utils'];

function gameController($scope, $state, gameService, userGameData, gameConstants, $ionicPopup, $timeout, $q, AdMob, $ionicPlatform, utils) {
  var vm = this;

  vm.onChoosableClick = onChoosableClick;
  vm.onSelectedClick = onSelectedClick;
  vm.onHelpClick = onHelpClick;
  vm.onSkipClick = onSkipClick;
  vm.onRevealClick = onRevealClick;
  vm.onPurchaseClick = onPurchaseClick;
  vm.skipLevel = skipLevel;
  vm.animateCoins = animateCoins;
  vm.zoomInImage = zoomInImage;
  vm.showFullImage = false;

  var emptyLetter = " ";
  var hintPopup, adDismissedListener, rewardVideoCompleteListener;

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

    if (vm.currentLevel > gameConstants.totalLevels) {
        return $state.transitionTo('success', null, {reload: true, notify:true});
    } else {
      loadCurrentlevel(true);
    }


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
      vm.puzzleImages = utils.getPuzzleImages( vm.currentLevel, gameConstants.imageSet );
      loadCurrentlevel(false);
    }

    $timeout.cancel(popupPromise);
    popupPromise = $timeout(function() {
        onHelpClick({currentTarget:null});
      }, 30000);

  });

  function loadCurrentlevel(firstCall){
    if(vm.puzzleData){
      if( vm.cachedPuzzleData.currentLevel != vm.currentLevel ){ //If cached data is outdated
        vm.solution  = getSolutionLetters( vm.puzzleData["solutions"][vm.currentLevel] );
        vm.choosableLetters = getChoosableLetters( vm.puzzleData["letterBucket"], vm.solution );
        vm.selectedLetters = utils.wrapLetters( vm.solution.map(function() { return emptyLetter }) );

        userGameData.setCachedPuzzleData( vm.choosableLetters, vm.selectedLetters, vm.solution, vm.currentLevel);

        var logEventName = "game_level_" + vm.currentLanguage;
        if(analytics){
          analytics.logEvent(logEventName, {level: vm.currentLevel});
        }
      }
      else{

        vm.solution  = vm.cachedPuzzleData.solution;
        vm.choosableLetters = vm.cachedPuzzleData.choosableLetters;
        vm.selectedLetters = vm.cachedPuzzleData.selectedLetters;

        if(firstCall){
          //Removing non affixed selected letters in cache
          vm.selectedLetters.forEach(function(value,index){
              if(!value.affixed){
                onSelectedClick(index);
              }
          });
        }

      }
    }
  }

  function getSolutionLetters( cryptedSolution) {
    var decryptedSolution = CryptoJS.AES.decrypt(cryptedSolution, gameConstants.salt).toString(CryptoJS.enc.Utf8);
    return graphemeSplitter.splitGraphemes(decryptedSolution) ;
  }

  function getChoosableLetters(letterBucket, solutions) {
    var randomLettersReq ;
    if(vm.currentLanguage == "tamil")
      randomLettersReq = gameConstants.maxChoosableLettersTamil - solutions.length;
    else
     randomLettersReq = gameConstants.maxChoosableLetters - solutions.length;
    var filteredBucket = utils.filterLetterBucket(letterBucket, randomLettersReq);
    var choosableLetters = utils.shuffle( filteredBucket.concat(solutions) );
    choosableLetters = utils.breakConsecutive( choosableLetters, solutions);
    return utils.wrapLetters(choosableLetters);
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
    } else {
      vm.allSelected = allSelectedFlag;
    }
  }

  function showLevelSucccess(level) {

    var levelSuccessPopup = $ionicPopup.alert({
       cssClass: 'level-success-popup',
       templateUrl: 'templates/popup/levelSuccess.html',
       scope: $scope,
       okText: ' '
     });

  $timeout.cancel(popupPromise);

   if( level % gameConstants.adsOnEveryNthLevel === 0 ) {
    $timeout(function(){
      AdMob.showInterstitial();
    }, 700);
   }


     $scope.onContinueClick = function(button,$event){
        $timeout(function(){
          levelSuccessPopup.close();
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
    var hostIndex = vm.selectedLetters[index].hostIndex;
    if( !vm.selectedLetters[index].affixed && !isNaN(hostIndex) ){
      vm.selectedLetters[index].letter = emptyLetter;
      vm.choosableLetters[hostIndex].active = true;
      vm.allSelected = false;
      userGameData.setCachedPuzzleData( vm.choosableLetters, vm.selectedLetters, vm.solution, vm.currentLevel);
    }
  }

 function onHelpClick($event) {
    vm.revealCoins = gameConstants.revealCoins;
    vm.skipCoins = gameConstants.skipCoins;

    var callback = function() {
      hintPopup = $ionicPopup.alert({
                     cssClass: 'primary-popup hints-popup',
                     templateUrl: 'templates/popup/hints.html',
                     scope: $scope,
                     okText: ' '
      });

      $timeout.cancel(popupPromise);
      AdMob.showBanner();

      $scope.closeConfirm = function(){
          hintPopup.close();
          AdMob.hideBanner();
          backbuttonRegistration();
      }
    }

    var backbuttonRegistration = $ionicPlatform.registerBackButtonAction(function(e) {
          hintPopup.close();
          AdMob.hideBanner();  
          backbuttonRegistration();   
    }, 401);

    utils.clickEffect($event.currentTarget, callback);

    var logParams = { click: "forced"}
    if($event.currentTarget !== null) {
      logParams.click = "intentional";
      logParams.level = vm.currentLevel;
      logParams.language = vm.currentLanguage;
      logParams.coins = vm.currentCoins;
    } 

    if(analytics){
      analytics.logEvent("game_hint", logParams);
    }

  }

  function onRevealClick($event) {
    if(vm.currentCoins >= gameConstants.revealCoins) {
      var callback =  function(){
        revealLetter();
        hintPopup.close();
        AdMob.hideBanner(); 
      }
      utils.clickEffect($event.currentTarget, callback);

      var logEventName = "reveal_letter_" + vm.currentLanguage;
      if(analytics){
        analytics.logEvent(logEventName, {level: vm.currentLevel});
      }
    }

  }

  function onSkipClick($event) {
    if(vm.currentCoins >= gameConstants.skipCoins) {

      var logEventName = "skip_level_" + vm.currentLanguage;
      if(analytics){
          analytics.logEvent(logEventName, {level: vm.currentLevel});
      }

      var callback =  function(){
        skipLevel();
        hintPopup.close();
        AdMob.hideBanner(); 
      }
      utils.clickEffect($event.currentTarget, callback);

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

        userGameData.setUserData(vm.currentLevel, vm.currentCoins-gameConstants.revealCoins);
        userGameData.setCachedPuzzleData( vm.choosableLetters, vm.selectedLetters, vm.solution, vm.currentLevel);

        userGameData.getUserData().then(function (value) {
           vm.currentCoins = value.currentCoins;
           checkLevelSuccess();
         });


      } else {
        revealLetter();
      }

  };

  function skipLevel() {
      vm.currentLevel = vm.currentLevel + 1;
      vm.currentCoins = vm.currentCoins - gameConstants.skipCoins
      userGameData.setUserData(vm.currentLevel, vm.currentCoins, vm.currentLanguage)
      vm.allSelected = false;
  }

  function onPurchaseClick($event, hintPopupClosed){

    if(!hintPopupClosed) {
      hintPopup.close();
    }

    $timeout.cancel(popupPromise);

    utils.clickEffect($event.currentTarget, function(){
      var purchasePopup = $ionicPopup.alert({
               cssClass: 'primary-popup purchase-popup',
               templateUrl: 'templates/popup/purchase.html',
               scope: $scope,
               okText: ' '
      });

      
      AdMob.prepareRewardVideo(false);
      AdMob.showBanner();

      if(typeof inAppPurchase !== 'undefined') {
        inAppPurchase
          .getProducts(gameConstants.productIds)
          .then(function (products) {
            $scope.$apply(function () {
              vm.products = utils.extractNames(products);
              vm.loadingOver = true;
            });
          })
          .catch(function () {
            vm.cannotPurchase = true;
            vm.loadingOver = true;
          });
      } else {
        vm.cannotPurchase = true;
        vm.loadingOver = true;
      }
      
      $scope.buyProduct = function($event, productId){
        utils.clickEffect($event.currentTarget, function(){
          if(typeof inAppPurchase !== 'undefined') {
            inAppPurchase
              .buy(productId)
              .then(function(data){
                var setCoins = vm.currentCoins + gameConstants.bundles[productId];
                isNaN(setCoins)? null : userGameData.setUserData(vm.currentLevel, setCoins);
                userGameData.setShowAds(false);
                return inAppPurchase.consume(data.type, data.receipt, data.signature); 
              })
              .then(function(){
                purchasePopup.close();
                AdMob.hideBanner();
              })
              .catch(function (err) {
                  alert("Please try again later");
                  purchasePopup.close();
                  AdMob.hideBanner();
               });
          }
          else{
            alert("Please try again later");
            purchasePopup.close();
            AdMob.hideBanner();
          }
        });
      }
      $scope.closeConfirm = function(){
          purchasePopup.close();
          AdMob.hideBanner();
          backbuttonRegistration();
      }

      var backbuttonRegistration = $ionicPlatform.registerBackButtonAction(function(e) {
            purchasePopup.close();
            AdMob.hideBanner();  
            backbuttonRegistration();   
      }, 401);

      $scope.rewardVideo = function($event) {
        utils.clickEffect($event.currentTarget, function(){
          if(AdMob) {
            AdMob.showRewardVideo();
            vm.loadingOver = false;
            vm.gotReward = false;
          } else{
            alert("Please try again later");
          }
        });
      }

      vm.gotReward = false;
      $scope.rewardCoins = gameConstants.rewardCoins;

      if(analytics){
        analytics.logEvent("game_purchase", null);
      }

       // vm.cannotPurchase = false;
    });
  }

  adDismissedListener = $scope.$on('adDismissed', function(){
    $scope.$apply(function () {
      vm.loadingOver = true;
    });
  });

  rewardVideoCompleteListener = $scope.$on('rewardVideoComplete', function(){
    $scope.$apply(function () {
      vm.loadingOver = true;
      vm.gotReward = true;
      vm.currentCoins = vm.currentCoins + gameConstants.rewardCoins;
      userGameData.setUserData(vm.currentLevel, vm.currentCoins);
    });
  }); 

  function animateCoins() {
    var options = utils.animateOptions();
    var count = new CountUp("coins", vm.currentCoins, vm.currentCoins + gameConstants.levelCoins , 0, 1, options);
    $timeout(function() {
      count.start();
    }, 400);
  }

  function zoomInImage(imageUrl) {
    vm.zoomInImageUrl = imageUrl;
    vm.showFullImage = true;
  }

  var popupPromise = $timeout(function() {
    onHelpClick({currentTarget:null});
  }, 30000);

  $scope.$on('$destroy', function(){
      $timeout.cancel(popupPromise);
      adDismissedListener();
      rewardVideoCompleteListener();
  });

}



