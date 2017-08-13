var gameModule = angular.module('game4p1w', ['ionic', 'ionic.native', 'ngCordova.plugins.nativeStorage','countUpModule']);

var appVersion = undefined;
var analytics = undefined;
var listenerAdded = false;

gameModule.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
});

gameModule.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova) {
      if(window.cordova.plugins.Keyboard){
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }

      cordova.getAppVersion(function(version) {
        appVersion = version;
      });

      if(window.cordova.plugins.firebase.analytics) {
        analytics = window.cordova.plugins.firebase.analytics;
      }
    }
    if(window.StatusBar) {
      StatusBar.hide();
    }
  });

})
