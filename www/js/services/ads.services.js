'use strict';

gameModule.factory('AdMob', adMob);

adMob.$inject = ['$window'];

function adMob($window){

	var _admob;
	var _admobid;

	var _interstitialReady;
	
	function init(){
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
		   console.log("No AdMob");
		}
   	}

   	function prepareInterstitial(bShow){
   		if( !_admob ) return false;
   		_admob.prepareInterstitial({
		    adId: _admobid.interstitial,
		    autoShow: bShow,
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
