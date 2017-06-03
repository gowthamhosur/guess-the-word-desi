'use strict';

gameModule.controller('homeController', homeController);
homeController.$inject = ['$scope', '$ionicPlatform', 'gameService' ,'$state', 'userGameData','$timeout','gameConstants','$ionicPopup']

function homeController($scope, $ionicPlatform, gameService, $state,userGameData,$timeout,gameConstants,$ionicPopup ) {

	var vm = this;
	vm.onPlayClick = onPlayClick;
	vm.onLanguageClick = onLanguageClick;
	vm.changeLanguage = changeLanguage;

	var languagePopup;

	$ionicPlatform.ready(function(){
		gameService.getCopy().then(function(response){
			vm.languages = response.data;

			userGameData.getLanguage().then(function (language) {
			    setLogo(language);
			});
		});
	});

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

		$scope.closeConfirm = function(){
	        languagePopup.close();
	    }

	}

	function changeLanguage(language) {
		userGameData.setLanguage(language);
		userGameData.setUserData(gameConstants.initialLevel,gameConstants.initialCoins);
		userGameData.resetPuzzleData();
		setLogo(language);
		languagePopup.close();
	}

	function setLogo(language){
		vm.logo = vm.languages[language].logo;
	}

}
