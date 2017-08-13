var app = angular.module('game4p1w');

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeController',
      controllerAs: 'vm'
    })
    .state('game', {
      url: '/game',
      templateUrl: 'templates/game.html',
      controller: 'gameController',
      controllerAs: 'vm'
    })
    .state('success', {
      url: '/success',
      templateUrl: 'templates/success.html',
      controller: 'successController',
      controllerAs: 'vm'
    });
  $urlRouterProvider.otherwise('/home');
});
