/**
 * Created by harsh on 4/9/2017.
 */
'use strict';

gameModule.controller('homeController', homeController);
homeController.$inject = ['$scope', '$rootScope', 'gameService', 'userGameData']

function homeController($scope, $rootScope, gameService, userGameData) {

    var userData = gameService.getUserData();
    console.log(userData);
    userGameData.setCurrentLevel(userData.currentLevel);
    userGameData.setCurrentCoins(userData.currentCoins);

}
