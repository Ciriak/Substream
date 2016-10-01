var apiIndex = "http://127.0.0.1:3000";
var spinnerUrl = "img/miscs/spinner.svg";
var app = angular.module('substream', [
'ui.router',
'jm.i18next',  //translation
'ngCookies',
'angularResizable',
'ngDragDrop'
    ]);

app.directive('fallbackSrc', function ()    //on error manager for img
{
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.fallbackSrc);
      });
    }
   };
   return fallbackSrc;
});

app.config(['$httpProvider',
function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);

app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");
  $urlRouterProvider.when('/{sheetId:int}', '/{sheetId:int}/chat');
  $urlRouterProvider.when('/{sheetId:int}/settings', '/{sheetId:int}/settings/info');
  $urlRouterProvider.when('/{sheetId:int}/users', '/{sheetId:int}/users/list');
  //
  // Now set up the states
  $stateProvider
    .state('main', {
      url: "/",
      templateUrl: "views/index.html",
      reload:true
    })
    .state('editor', {
      url: "/{sheetId:int}",
      templateUrl: "views/editor/editor.html",
      controller: "editorCtrl",
      reload:true,
      onEnter: function($rootScope, $timeout, $stateParams) {
        //used $timeout to load after controller gets initialized
        //so that $on event should get define before broadcasting
        $timeout(function() {
            $rootScope.$broadcast('initializeEditor', $stateParams.registrationseed);
        })
      }
    })
    .state('editor.chat', {
      url: "/chat",
      templateUrl: "views/editor/chat.html"
    })
    .state('editor.settings', {
      url: "/settings",
      templateUrl: "views/editor/settings.html"
    })
      .state('editor.settings.info', {
        url: "/info",
        templateUrl: "views/editor/settings/info.html"
      })
      .state('editor.settings.groups', {
        url: "/groups",
        templateUrl: "views/editor/settings/groups.html"
      })
    .state('editor.history', {
      url: "/history",
      templateUrl: "views/editor/history.html"
    })
    .state('editor.subtitle', {
      url: "/subtitle",
      templateUrl: "views/editor/subtitle.html"
    })
    .state('editor.users', {
      url: "/users",
      templateUrl: "views/editor/users.html"
    })
    .state('editor.users.list', {
      url: "/list",
      templateUrl: "views/editor/users/list.html"
    })
    .state('editor.users.details', {
      url: "/{userId:int}",
      templateUrl: "views/editor/users/details.html"
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html",
      controller: "loginCtrl"
    })
    .state('signUp', {
      url: "/signup",
      templateUrl: "views/sign_up.html",
      controller: "signUpCtrl"
    });
});

app.controller('mainCtrl', ['$scope', '$http','$rootScope','$cookies', function($scope, $http,$rootScope,$cookies)
{

  $http.get(apiIndex+"/me?token="+$cookies.get("sbstr_token"))
  .then(function(r)
  {
    if(r.data.success)
    {
      $scope.headerUserView = "views/header/logged.html";
      
      $scope.user = r.data.me[0];
      $scope.me = r.data.me[0];
      $cookies.put("user_id",r.data.me[0].id);
    }
    else
    {
      $scope.headerUserView = "views/header/not_logged.html";
    }
  },function(r)
  {
  	$scope.headerUserView = "views/header/not_logged.html";
  });

  $rootScope.$on('$stateChangeStart', 
  function(event, toState, toParams, fromState, fromParams)
  {
    /*if(!$cookies.get("sbstr_token") && document.location.hash != "#/"){ //auto redirect unlogged users
      document.location.hash = "/";
      location.reload();
    }*/
  });

}]);