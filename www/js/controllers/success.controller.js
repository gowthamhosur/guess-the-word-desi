'use strict';

gameModule.controller('successController', successController);

function successController(userGameData,gameConstants,$ionicPlatform, $state, $scope, $timeout) {
  var vm = this;
  vm.onPlayAgainClick = onPlayAgainClick;

  function onPlayAgainClick() { 
    userGameData.setUserData(gameConstants.initialLevel,undefined, vm.currentLanguage);
    userGameData.setCachedPuzzleData({});
    $timeout(function(){
        $state.transitionTo('game', null, {reload: true, notify:true});
         }, 300);
  }
  

  $ionicPlatform.ready(function(){

    userGameData.getLanguage().then(function (language) {
        vm.currentLanguage = language;
    });

	  var backButton = $ionicPlatform.registerBackButtonAction(
	        function() {
	          $state.transitionTo('home', null, {reload: true, notify:true});
	        }, 100);
	  $scope.$on('$destroy', backButton);
  })

}
