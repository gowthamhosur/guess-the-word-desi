'use strict';

gameModule.controller('successController', successController);

function successController(userGameData,gameConstants,$ionicPlatform, $state, $scope) {
  var vm = this;
  vm.playAgain = playAgain;

  function playAgain() {
    userGameData.setUserData(gameConstants.initialLevel,gameConstants.initialCoins);
  }

  $ionicPlatform.ready(function(){
	  var backButton = $ionicPlatform.registerBackButtonAction(
	        function() {
	          $state.transitionTo('home', null, {reload: true, notify:true});
	        }, 100);
	  $scope.$on('$destroy', backButton);
  })

}
