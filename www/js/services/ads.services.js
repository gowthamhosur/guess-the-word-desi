'use strict';

gameModule.factory('AdMob', adMob);

adMob.$inject = ['$window'];

function adMob($window){

	var _admob;
	var _admobid;

	var _interstitialReady;
	
	function init(){
   		console.log("AdMob init");

   		_admob = $window.AdMob;

		if(_admob){

		   	_admobid = {};

			if(ionic.Platform.isAndroid()) {
				_admobid = { // for Android
					interstitial: 'ca-app-pub-5894873097908977/2511636643'
				};
			}

		   	if(ionic.Platform.isIOS()){
		    	_admobid = { // for iOS
					interstitial: 'ca-app-pub-5894873097908977/6941836240'
		    	};
		   	}

		   	document.addEventListener('onAdDismiss', function(){
		   		_interstitialReady = false;
		   	});
		   	
		   	this.prepareInterstitial(false);

		} else {
		   console.log("No AdMob?");
		}
   	}

   	function prepareInterstitial(bShow){
   		if( !_admob ) return false;
   		_admob.prepareInterstitial({
		    adId: _admobid.interstitial,
		    isTesting: true, //TODO: Remove in production. MUST BE TRUE IN DEVELOPEMENT!!!
		    autoShow: bShow,
		    success: function(){
		    	_interstitialReady = true;
		    	console.log('interstitial prepared');
		    },
		    error: function(){
		    	console.log('failed to prepare interstitial');
		    }
	   	})

	   	return true;
   	}

   	function showInterstitial() {
   		if( !_interstitialReady ){
   			console.log('interstitial not ready');
   			return this.prepareInterstitial(true);
   		}

       	_admob.showInterstitial();

       	return true;
   	}

 var service = {
    init: init,
    prepareInterstitial: prepareInterstitial,
    showInterstitial: showInterstitial
  };

  return service;

}
