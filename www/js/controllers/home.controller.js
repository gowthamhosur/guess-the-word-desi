/**
 * Created by harsh on 4/9/2017.
 */
'use strict';

gameModule.controller('homeController', homeController);
homeController.$inject = ['$scope', '$rootScope', 'gameService', 'userGameData']

function homeController($scope, $rootScope, gameService, userGameData) {

    gameService.getUserData()
      .success(function(data){
      userGameData.setCurrentLevel(data.currentLevel);
      userGameData.setCurrentCoins(data.currentCoins);
      })
      .error(function(err){
      console.log(err, "Error while retrieving App Data")
      });

}
