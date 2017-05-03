/**
 * Created by harsh on 4/9/2017.
 */
var app = angular.module('game4p1w');

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeController',
      controllerAs: 'homeVm'
    })
    .state('game', {
      url: '/game',
      templateUrl: 'templates/game.html',
      controller: 'gameController',
      controllerAs: 'gameVm'
    })
    .state('success', {
      url: '/success',
      templateUrl: 'templates/success.html',
      controller: 'successController',
      controllerAs: 'successVm'
    });
  $urlRouterProvider.otherwise('/home');
});
