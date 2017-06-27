'use strict';

gameModule.controller('homeController', homeController);
homeController.$inject = ['$scope','$ionicPlatform','gameService' ,'$state', 'userGameData','$timeout','gameConstants','$ionicPopup', 'AdMob']

function homeController($scope, $ionicPlatform, gameService, $state,userGameData,$timeout,gameConstants,$ionicPopup,AdMob ) {

	var vm = this;
	vm.onPlayClick = onPlayClick;
	vm.onLanguageClick = onLanguageClick;
	vm.onAdClick = onAdClick;
	vm.changeLanguage = changeLanguage;

	var languagePopup, purchasePopup;

	//Stub data
	// vm.products = tuneProducts( [{productId: 'guesstheworddesi_first_bundle_coins', title: '500 (Guess the word)', price: '50 Rs'}, 
					// {productId: 'guesstheworddesi_second_bundle_coins', title: '1500 (Guess the word)', price: '100 Rs'},
					// {productId: 'guesstheworddesi_third_bundle_coins', title: '2500 (Guess the word)', price: '125 Rs'}] );

	$ionicPlatform.ready(function(){
		gameService.getCopy().then(function(response){
			vm.languages = response.data;

			userGameData.getLanguage().then(function (language) {
			    setGameLanguage(language);
			});

			userGameData.getUserData().then(function( userData){
				vm.currentLevel = userData.currentLevel;
				vm.currentCoins = userData.currentCoins;
			})

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
			purchasePopup = $ionicPopup.alert({
				       cssClass: 'primary-popup purchase-popup',
				       templateUrl: 'templates/popup/purchase.html',
				       scope: $scope,
				       okText: ' '
			});

			if(typeof inAppPurchase !== 'undefined') {
				inAppPurchase
				  .getProducts(gameConstants.productIds)
				  .then(function (products) {
				  	$scope.$apply(function () {
				    	vm.products = tuneProducts(products);
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
				gameService.clickEffect($event.currentTarget, function(){
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
						  })
						  .catch(function (err) {
						      alert("Please try again later");
						      purchasePopup.close();
						   });
					}
					else{
						alert("Please try again later");
						purchasePopup.close();
					}
				});
			}
			$scope.closeConfirm = function(){
			    purchasePopup.close();
			}

			 // vm.cannotPurchase = false;
		});
	}

	function tuneProducts(products) {
		return products.map(function(item){
			item.title = item.title.replace(/ *\([^)]*\) */g, "");
			return item;
		})
	}
	function changeLanguage($event, language) {
		gameService.clickEffect($event.currentTarget, function(){
			if(vm.currentLanguage != language){
				userGameData.setLanguage(language);
				userGameData.getLevelProgress().then(function(levelProgress){
					userGameData.setUserData(levelProgress[language]);
				})
				userGameData.setCachedPuzzleData({});
				setGameLanguage(language);
			}
			languagePopup.close();
			return;
		});
		
	}

	function setGameLanguage(language){
		vm.currentLanguage = language;
		vm.logo = vm.languages[language].logo;
	}

}
