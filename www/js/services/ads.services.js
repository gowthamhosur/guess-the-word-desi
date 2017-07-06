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
					interstitial: 'your-ad-publish-key'
				};
			}

		   	if(ionic.Platform.isIOS()){
		    	_admobid = { // for iOS
					interstitial: 'your-ad-publish-key'
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
