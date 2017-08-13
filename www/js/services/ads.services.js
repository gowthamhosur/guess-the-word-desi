'use strict';

gameModule.factory('AdMob', adMob);

adMob.$inject = ['$window', '$rootScope', 'userGameData', 'gameConstants'];

function adMob($window, $rootScope, userGameData, gameConstants){

	var _admob;
	var _admobid;

	var _interstitialReady;
	var _rewardReady;
	var _bannerReady;
	
	function init(){
   		_admob = $window.AdMob;

   		userGameData.getShowAds().then(function(showAds){
   		  if(showAds && gameConstants.showAds && _admob) {
   		  	   	_admobid = {};

   		  		if(ionic.Platform.isAndroid()) {
   		  			_admobid = { // for Android
   		  				interstitial: 'ca-app-pub-3940256099942544/5224354917',
   		  				reward: 'ca-app-pub-3940256099942544/1033173712',
   		  			 	banner : 'ca-app-pub-3940256099942544/6300978111'
   		  			};

   		  			//These are sample id from Google Admob for testing
   		  		}
   		  		if(!listenerAdded) {
	   		  	   	document.addEventListener('onAdDismiss', function() {
		   		  			_interstitialReady = false;
		   		  			_rewardReady = false;
		   		  			$rootScope.$broadcast('adDismissed');
		   		  	});
	   		  	   	document.addEventListener('onAdPresent', function(e) {
   		  					if(e.adType == 'rewardvideo') { 
		   		  			  $rootScope.$broadcast('rewardVideoComplete');
		   		  			}
		   		  	});
	   		  	   	listenerAdded = true;
   		  		}

   		  	   	prepareInterstitial(false);
   		  	   	prepareBanner(false);

   		  }
   		  else {
			   console.log("No AdMob");
			}
   		})
   	}

   	function prepareInterstitial(bShow){
   		if( !_admob ) return false;
   		_admob.prepareInterstitial({
		    adId: _admobid.interstitial,
		    autoShow: bShow,
		    isTesting: true, //TODO: Remove in production. MUST BE TRUE IN DEVELOPEMENT!!!
		    success: function(){
		    	_interstitialReady = true;
		    },
		    error: function(){
		    	console.log('failed to prepare interstitial');
		    }
	   	})

	   	return true;
   	}

   	function showInterstitial() {
   		if( !_interstitialReady ){
   			return this.prepareInterstitial(true);
   		}

   		userGameData.getShowAds().then(function(showAds){
   		  if(showAds && gameConstants.showAds && _admob) {
       		_admob.showInterstitial();
   			}
   		});


       	return true;
   	}

   	function prepareRewardVideo(bShow){
   		if( !_admob ) return false;

   		_admob.prepareRewardVideoAd({
		    adId: _admobid.reward,
		    autoShow: bShow,
		    isTesting: true, //TODO: Remove in production. MUST BE TRUE IN DEVELOPEMENT!!!
		    success: function(){
		    	_rewardReady = true;
		    },
		    error: function(){
		    	console.log('failed to prepare reward video');
		    }
	   	})

	   	return true;
   	}

   	function showRewardVideo() {
   		if( !_rewardReady ){
   			return this.prepareRewardVideo(true);
   		}

       	_admob.showRewardVideoAd();

       	return true;
   	}
 	
 	function prepareBanner(bShow){
   		if( !_admob ) return false;
   		_admob.createBanner({
		    adId: _admobid.banner,
		    adSize:'SMART_BANNER', 
		    overlap:true, 
		    position:_admob.AD_POSITION.TOP_CENTER,
		    autoShow: bShow,
		    success: function(){
		    	_bannerReady = true;
			},
			error: function(){
				console.log('failed to create banner');
			}
	   	})

	   	return true;
   	}

   	function showBanner() {
   		if( !_bannerReady ){
   			return this.prepareBanner(true);
   		}

   		userGameData.getShowAds().then(function(showAds){
   		  if(showAds && gameConstants.showAds && _admob) {
   		  	_admob.showBanner(2);
   			}
   		});

       	return true;
   	}

   	function hideBanner() {
   		if( !_admob ) return false;
       	_admob.hideBanner();

       	return true;
   	}

	var service = {
	    init: init,
	    prepareInterstitial: prepareInterstitial,
	    showInterstitial: showInterstitial,
	    prepareRewardVideo: prepareRewardVideo,
	    showRewardVideo: showRewardVideo,
	    prepareBanner: prepareBanner,
	    showBanner: showBanner,
	    hideBanner: hideBanner
	};

	return service;

}
