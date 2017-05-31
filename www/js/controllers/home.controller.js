/**
 * Created by harsh on 4/9/2017.
 */
'use strict';

gameModule.controller('homeController', homeController);
homeController.$inject = ['$scope', 'gameService' ,'$state', 'userGameData','$timeout','gameConstants','$ionicPopup']
//inject userGameData to declare initial values before using them in game controller

function homeController($scope, gameService, $state,userGameData,$timeout,gameConstants,$ionicPopup ) {

	var vm = this;

	gameService.getCopy().then(function(response){
		vm.languages = response.data;
		setLogo();
	})

	vm.onPlayClick = onPlayClick;
	vm.onLanguageClick = onLanguageClick;
	vm.changeLanguage = changeLanguage;

	var languagePopup;

	function onPlayClick($event){
		$timeout(function(){
		 $state.transitionTo('game');
		},400)
	}

	function onLanguageClick(){
		languagePopup = $ionicPopup.alert({
	       cssClass: 'primary-popup language-popup',
	       templateUrl: 'templates/popup/language.html',
	       scope: $scope,
	       okText: ' '
	     });

	}

	function changeLanguage(language) {
		gameConstants.language = vm.languages[language].language;
		setLogo();
		userGameData.setUserData(gameConstants.initialLevel,gameConstants.initialCoins);
		languagePopup.close();
	}

	function setLogo(){
		vm.logo = vm.languages[gameConstants.language].logo;
	}

}
