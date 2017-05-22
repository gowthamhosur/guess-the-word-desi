/**
 * Created by harsh on 4/9/2017.
 */
'use strict';

gameModule.controller('homeController', homeController);
homeController.$inject = ['$scope','$state','$timeout']

function homeController($scope,$state,$timeout) {

	var vm = this;

	vm.onPlayClick = onPlayClick;

	function onPlayClick($event){
		$timeout(function(){
		 $state.transitionTo('game');
		},400)
	}

}
