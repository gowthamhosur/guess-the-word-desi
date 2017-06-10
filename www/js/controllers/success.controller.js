'use strict';

gameModule.controller('successController', successController);

function successController(userGameData,gameConstants) {
  var vm = this;


  vm.playAgain = playAgain;

  function playAgain() {
    userGameData.setUserData(gameConstants.initialLevel,gameConstants.initialCoins);
  }
}
