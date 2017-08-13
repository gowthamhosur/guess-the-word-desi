'use strict';

gameModule.factory('gameService', gameService);

gameService.$inject = ['$http', '$q', '$window'];

function gameService($http, $q, $window){

	function getPuzzleData(){
		var solutions = $http.get('appdata/solutions.json'),
		letterBucket = $http.get('appdata/letterBucket.json');

		return $q.all([solutions,letterBucket]);
	}

	function getCopy(){
		return $http.get('appdata/copy.json');
	}

	function setInitialRun (initial) {
	    $window.localStorage["initialRun"] = (initial ? "true" : "false");
	}
	 
	function isInitialRun() {
	    var value = $window.localStorage["initialRun"] || "true";
	    return value == "true";
	}

	function setUniqueId () {
	    $window.localStorage["uniqueId"] = Math.floor(Math.random() * 900000) + 100000;
	}
	 
	function getUniqueId() {
		if(isNaN($window.localStorage["uniqueId"]))
			this.setUniqueId();
	    return $window.localStorage["uniqueId"];
	}

	function setVersion (version) {
	    $window.localStorage["appVersion"] = version;
	}
	 
	function getVersion() {
	    return $window.localStorage["appVersion"];
	}


	var service = {
    getPuzzleData: getPuzzleData,
    getCopy: getCopy,
    setInitialRun: setInitialRun,
    isInitialRun: isInitialRun,
    setVersion: setVersion,
    getVersion: getVersion,
    setUniqueId: setUniqueId,
    getUniqueId: getUniqueId
  };

  return service;

}
