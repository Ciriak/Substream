var app = angular.module('substream', []);

app.controller('mainCtrl', ['$scope', '$http','$rootScope', function($scope, $http, $rootScope)
{
  $scope.project = new Project();
}]);
