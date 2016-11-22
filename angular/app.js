var app = angular.module('celebrityQuizz', ['angular-google-gapi']);

app.run(['GApi', 'GAuth',
  function(GApi, GAuth) {
      var BASE = 'https://quizzcelebrity-149400.appspot.com/_ah/api';
      GApi.load('quizzcelebrityendpoint','v1',BASE).then(function(resp) {
          console.log('api: ' + resp.api + ', version: ' + resp.version + ' loaded');
      }, function(resp) {
          console.log('an error occured during loading api: ' + resp.api + ', resp.version: ' + version);
      });
  }
]);


/*app.run(['GAuth', 'GApi', 'GData', '$state', '$rootScope',
    function(GAuth, GApi, GData, $state, $rootScope) {

        $rootScope.gdata = GData;

        var CLIENT = '770415131518-otnjoc83imqb99d1j95ssd0h9he599jb.apps.googleusercontent.com';
        var BASE = 'https://quizzcelebrity-149400.appspot.com/_ah/api';

        GApi.load('quizzcelebrityendpoint','v1',BASE).then(function(resp) {
          console.log('api: ' + resp.api + ', version: ' + resp.version + ' loaded');
      }, function(resp) {
          console.log('an error occured during loading api: ' + resp.api + ', resp.version: ' + version);
      });
        GApi.load('calendar','v3'); // for google api (https://developers.google.com/apis-explorer/)

        GAuth.setClient(CLIENT)
        // default scope is only https://www.googleapis.com/auth/userinfo.email
        GAuth.setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly');

        // load the auth api so that it doesn't have to be loaded asynchronously
        // when the user clicks the 'login' button.
        // That would lead to popup blockers blocking the auth window
        GAuth.load();

        // or just call checkAuth, which in turn does load the oauth api.
        // if you do that, GAuth.load(); is unnecessary
        GAuth.checkAuth().then(
            function (user) {
                console.log(user.name + ' is logged in');
                $state.go('webapp.home'); // an example of action if it's possible to
                                        // authenticate user at startup of the application
            },
            function() {
                $state.go('login'); // an example of action if it's impossible to
                                  // authenticate user at startup of the application
            }
        );
    }
]);*/












/*app.controller('AnswerController', ['$scope', 'GApi', function($scope, GApi){


	GApi.execute('quizzcelebrityendpoint','requeteDatastore', {theme:"musician"}).then(function(resp) {
	
	
	}





GApi.execute('scoreentityendpoint','insertScoreEntity',{id: Math.floor(Math.random()*1000000)+1, name: $scope.name, score: $scope.current_score}).then(function(resp) {




}]) ;*/



































var questions = [
  {
    q: "Quel type d'attaque est super efficace contre les pokemons de type insecte ?",
    answers: ['Feu','Eau', 'Glace'],
  },
  {
    q: "Combien de badges y a-t-il dans la première génération de pokémon ?",
    answers: ['8','12','3'],
  },
  {
    q: "Quel est le pokémon numéro 144 ?",
    answers: ['Artikodin','Minidraco','Pikachu'],
  },
];

var validation = {
  ok: "WOUAHOU té cro for!",
  pas_ok: "Té nulachié...",
};

app.controller('AnswerController', ['$scope', 'GApi', function($scope, GApi){
  
  $scope.iterator = 0;
  $scope.poolQuestions = questions;
  $scope.poolValidate = validation;
  $scope.valide = "";
  $scope.notfinished = true;
  $scope.page = null; 
  $scope.current_score = 0; 
  $scope.name = null;
  
  $scope.selection = function(numanswer) {
    
    if($scope.notfinished){
      if(numanswer == 1)
      {
        $scope.valide = $scope.poolValidate.ok;
        $scope.current_score++;
      }
      else
        $scope.valide = $scope.poolValidate.pas_ok;
      
      if($scope.iterator < $scope.poolQuestions.length -1)
        $scope.iterator++;
      else
      {
        $scope.notfinished = false;
        $scope.iterator = 0;
        $scope.addScore();
        $scope.openPage('endGame');
        $scope.name = null;
        $scope.valide = "";
      }
    }
  };
  
  $scope.reset = function(){
    $scope.current_score = 0;
    $scope.notfinished = true;
    $scope.page = 'play';
  };
  
  $scope.addScore = function() {
    GApi.execute('scoreentityendpoint','insertScoreEntity',{id: Math.floor(Math.random()*1000000)+1, name: $scope.name, score: $scope.current_score}).then(function(resp) {
        console.log('Good!');
      },function(e) {
        console.log('Error!');
        console.log(e);
      });
    }

  $scope.openPage = function(page) {
    $scope.page = page;

    if (page == 'play') {
      $scope.reset();
    } else if (page == 'highscores') {
      $scope.highscores = null;
      $scope.listScores(function(data) {
        $scope.highscores = data;
      });
    }
  }
  
  $scope.listScores = function(callback) {
    GApi.execute('scoreentityendpoint','listScoreEntity').then(function(resp) {
      callback(resp.items);
    }, function() {
      console.log('Error!');
    });
  }


// $scope.listScores = function() {
//   GApi.execute('scoreentityendpoint','listScoreEntity').then(function(resp) {
//     console.log('Affichage !');
//   }, function() {
//     console.log('Error!');
//   });
// }

$scope.openPage('play');

}]) ;






