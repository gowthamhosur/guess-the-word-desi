'use strict';

gameModule.controller('homeController', homeController);
homeController.$inject = ['$scope','$ionicPlatform','gameService' ,'$state', 'userGameData','$timeout','gameConstants','$ionicPopup', 'AdMob']

function homeController($scope, $ionicPlatform, gameService, $state,userGameData,$timeout,gameConstants,$ionicPopup,AdMob ) {

	var vm = this;
	vm.onPlayClick = onPlayClick;
	vm.onLanguageClick = onLanguageClick;
	vm.onAdClick = onAdClick;
	vm.changeLanguage = changeLanguage;

	var languagePopup;

	$ionicPlatform.ready(function(){
		gameService.getCopy().then(function(response){
			vm.languages = response.data;

			userGameData.getLanguage().then(function (language) {
			    setGameLanguage(language);
			});

		});

		//Initializing ads after 500ms
		$timeout(function(){
			userGameData.getShowAds().then(function(showAds){
				if(showAds) {
					AdMob.init();
				}
			});

			//Auto triggering popup on first run
			if (gameService.isInitialRun()) {
			    gameService.setInitialRun(false);
			    vm.onLanguageClick({currentTarget:null});
			}

			if(appVersion != undefined && appVersion != gameService.getVersion()){
				//App updated
				console.log(appVersion);
				gameService.setVersion(appVersion);
			}	

		},500)


	});

	function onPlayClick($event){
		$timeout(function() {
			$state.transitionTo('game');
		}, 300);
	}

	function onLanguageClick($event){

		gameService.clickEffect($event.currentTarget, function(){
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
	    );
	}

	function onAdClick($event){
		gameService.clickEffect($event.currentTarget, function(){
			return;
		});
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
