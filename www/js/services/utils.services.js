'use strict';

gameModule.factory('utils', utils);

utils.$inject = ['$timeout'];

function utils($timeout){

	function getPuzzleImages(currentLevel, imageSet) {
		return imageSet.map(function(src){
			return currentLevel + '/' + src
		})
	}

	function filterLetterBucket(letterBucket, count) {
		var tmp = letterBucket.slice(letterBucket);
		var ret = [];

		for (var i = 0; i < count; i++) {
			var index = Math.floor(Math.random() * tmp.length);
			var removed = tmp.splice(index, 1);
    		ret.push(removed[0]);
		}
		return ret;
	}

	function shuffle(array){
		var j, x, i;
		for (i = array.length; i; i--) {
			j = Math.floor(Math.random() * i);
			x = array[i - 1];
			array[i - 1] = array[j];
			array[j] = x;
		}

		return array;
	}

	function breakConsecutive(array, solutions) {
		//This function is to check if first two letters of solution are positioned conescutively,
		//and if so break them by swapping letters

		solutions = solutions.slice(0,2);

		var arraySubset =[]
		for (var i = 0; i < array.length - 1; i++) {
			arraySubset[0] = array[i];
			arraySubset[1] = array[i+1];

			if( areArraysEqual(arraySubset , solutions) ) {
				array[i] = arraySubset[1];
				array[i+1] = arraySubset[0];
			}
		}

		return array;
	}

	function areArraysEqual(array1, array2) {
		return (array1.length == array2.length) && array1.every(function(element, index) {
		    return element === array2[index]; 
		});

	}

	function clickEffect(element, callback) {
		angular.element(element).addClass("shrink");

		$timeout(function() {
				angular.element(element).removeClass("shrink");
				callback();
		}, 200);
	}

	function extractNames(products) {
		return products.map(function(item){
			item.title = item.title.replace(/ *\([^)]*\) */g, "");
			return item;
		})
	}

	// Returns an object of array elements
	function wrapLetters(letters) {
	  return letters.map(
	    function(element){
	      var temp = {
	        active: true,
	        letter: element
	      };
	      return temp;
	    });
	}

	function animateOptions() {
	    var easingFn = function (t, b, c, d) {
	    var ts = (t /= d) * t;
	    var tc = ts * t;
	    return b + c * (tc + -3 * ts + 3 * t);
	  }
	  var options = {
	    useEasing : true,
	    easingFn: easingFn,
	    useGrouping : true,
	    separator : ',',
	    decimal : '.',
	  };
	  return options;
	}


	var service = {
		getPuzzleImages: getPuzzleImages,
	    filterLetterBucket: filterLetterBucket,
	    shuffle: shuffle,
	    breakConsecutive: breakConsecutive,
	    clickEffect: clickEffect,
	    extractNames: extractNames,
	    wrapLetters: wrapLetters,
	    animateOptions: animateOptions
  };

  return service;

}
