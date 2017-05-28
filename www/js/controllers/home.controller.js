/**
 * Created by harsh on 4/9/2017.
 */
'use strict';

gameModule.controller('homeController', homeController);
homeController.$inject = ['$scope','$state', 'userGameData','$timeout']
//inject userGameData to declare initial values before using them in game controller

function homeController($scope,$state,userGameData,$timeout) {

	var vm = this;

	vm.onPlayClick = onPlayClick;

	function onPlayClick($event){
		$timeout(function(){
		 $state.transitionTo('game');
		},400)
	}

}
