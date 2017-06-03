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
			    setGameLanguage(language);
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
		if(vm.currentLanguage != language){
			userGameData.setLanguage(language);
			userGameData.getLevelProgress().then(function(levelProgress){
				userGameData.setUserData(levelProgress[language]);
			})
			userGameData.resetCahcedPuzzleData();
			setGameLanguage(language);
		}
		languagePopup.close();
	}

	function setGameLanguage(language){
		vm.currentLanguage = language;
		vm.logo = vm.languages[language].logo;
	}

}
