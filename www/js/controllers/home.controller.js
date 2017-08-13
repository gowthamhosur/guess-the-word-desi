'use strict';

gameModule.controller('homeController', homeController);
homeController.$inject = ['$scope','$ionicPlatform','gameService' ,'$state', 'userGameData','$timeout','gameConstants','$ionicPopup', 'AdMob', 'utils']

function homeController($scope, $ionicPlatform, gameService, $state,userGameData,$timeout,gameConstants,$ionicPopup,AdMob, utils ) {

	var vm = this;
	vm.onPlayClick = onPlayClick;
	vm.onLanguageClick = onLanguageClick;
	vm.onPurchaseClick = onPurchaseClick;
	vm.changeLanguage = changeLanguage;

	var languagePopup, purchasePopup, adDismissedListener, rewardVideoCompleteListener;

	//Stub data
	// vm.products = utils.extractNames( [{productId: 'guesstheworddesi_first_bundle_coins', title: '500 (Guess the word)', price: '50 Rs'}, 
	// 				{productId: 'guesstheworddesi_second_bundle_coins', title: '1500 (Guess the word)', price: '100 Rs'},
	// 				{productId: 'guesstheworddesi_third_bundle_coins', title: '2500 (Guess the word)', price: '125 Rs'}] );

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

			AdMob.init();

			//Auto triggering popup on first run
			if (gameService.isInitialRun()) {
			    gameService.setInitialRun(false);
			    vm.onLanguageClick({currentTarget:null});

			    gameService.setUniqueId();
			}
			if(analytics) {
				var uniqueId = gameService.getUniqueId();
				analytics.setUserId(uniqueId);
			}
			if(appVersion != undefined && appVersion != gameService.getVersion()){
				//App updated
				gameService.setVersion(appVersion);
				userGameData.setCachedPuzzleData({});
			}	

		},500)

	});

	function onPlayClick($event){
		$timeout(function() {
			$state.transitionTo('game');
		}, 300);
	}

	function onLanguageClick($event){
		utils.clickEffect($event.currentTarget, function(){
				languagePopup = $ionicPopup.alert({
					       cssClass: 'primary-popup language-popup',
					       templateUrl: 'templates/popup/language.html',
					       scope: $scope,
					       okText: ' '
				});

				AdMob.showBanner();

				$scope.closeConfirm = function(){
				    languagePopup.close();
				    AdMob.hideBanner();
				    backbuttonRegistration();
				}
			}
	    );

	    var backbuttonRegistration = $ionicPlatform.registerBackButtonAction(function(e) {
	          languagePopup.close();
	          AdMob.hideBanner();  
	          backbuttonRegistration();   
	    }, 401);

	    var logParams = { change: "initial"}
	    if($event.currentTarget !== null) {
	    	logParams.change = "noninitial"
	    }

	    if(analytics){
	      analytics.logEvent("language_change", logParams);
	    }
	}

	function onPurchaseClick($event){
		utils.clickEffect($event.currentTarget, function(){
			purchasePopup = $ionicPopup.alert({
				       cssClass: 'primary-popup purchase-popup',
				       templateUrl: 'templates/popup/purchase.html',
				       scope: $scope,
				       okText: ' '
			});

			AdMob.prepareRewardVideo(false);
			AdMob.showBanner();

			if(typeof inAppPurchase !== 'undefined') {
				inAppPurchase
				  .getProducts(gameConstants.productIds)
				  .then(function (products) {
				  	$scope.$apply(function () {
				    	vm.products = utils.extractNames(products);
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
				utils.clickEffect($event.currentTarget, function(){
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
                  			AdMob.hideBanner();
						  })
						  .catch(function (err) {
						      alert("Please try again later");
						      purchasePopup.close();
                  			  AdMob.hideBanner();
						   });
					}
					else{
						alert("Please try again later");
						purchasePopup.close();
						AdMob.hideBanner();
					}
				});
			}

			$scope.rewardVideo = function($event) {
				utils.clickEffect($event.currentTarget, function(){
					AdMob.showRewardVideo();
					vm.loadingOver = false;
					vm.gotReward = false;
				});
			}

			$scope.closeConfirm = function(){
			    purchasePopup.close();
			    AdMob.hideBanner();
			    backbuttonRegistration();
			}

			var backbuttonRegistration = $ionicPlatform.registerBackButtonAction(function(e) {
			      purchasePopup.close();
			      AdMob.hideBanner();  
			      backbuttonRegistration();   
			}, 401);

			vm.gotReward = false
			$scope.rewardCoins = gameConstants.rewardCoins;

			// vm.cannotPurchase = false;

		});

		if(analytics){
		  analytics.logEvent("home_purchase", null);
		}
	}


	function changeLanguage($event, language) {
		utils.clickEffect($event.currentTarget, function(){
			if(vm.currentLanguage != language){
				userGameData.setLanguage(language);
				userGameData.getLevelProgress().then(function(levelProgress){
					var setLevel = isNaN(levelProgress[language])? gameConstants.initialLevel: levelProgress[language];
					userGameData.setUserData(setLevel);
				})
				userGameData.setCachedPuzzleData({});
				setGameLanguage(language);

				if(analytics){
				  analytics.logEvent("language_" + language, null);
				}
			}
			languagePopup.close();
			AdMob.hideBanner();
			return;
		});
		
	}

	function animateCoins() {
	  var options = utils.animateOptions();
	  var count = new CountUp("reward", vm.currentCoins, vm.currentCoins + gameConstants.rewardCoins , 0, 1, options);
	  $timeout(function() {
	    count.start();
	  }, 400);
	}

	function setGameLanguage(language){
		vm.currentLanguage = language;
		vm.logo = vm.languages[language].logo;
	}

	adDismissedListener = $scope.$on('adDismissed', function(){
		$scope.$apply(function () {
			vm.loadingOver = true;
		});
	});

	rewardVideoCompleteListener = $scope.$on('rewardVideoComplete', function(){
		$scope.$apply(function () {
			vm.loadingOver = true;
			vm.gotReward = true;
			var setCoins = vm.currentCoins + gameConstants.rewardCoins;
			isNaN(setCoins)? null : userGameData.setUserData(vm.currentLevel, setCoins);

			$timeout(function() {
				animateCoins();
			}, 1000);
		});
	});	

	$scope.$on('$destroy', function(){
	    adDismissedListener();
	    rewardVideoCompleteListener();
	});

}
