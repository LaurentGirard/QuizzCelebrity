var CLIENT = '770415131518-s2is18ruc36nuo8ukvb5tgk5vm6r95kp.apps.googleusercontent.com';

var app = angular.module('celebrityQuizz', ['angular-google-gapi', 'ngCookies']);

var jsonObj = {
	notparsed: null,
	parsed: null,
};

var resultat;
var stateQ;

app.run(['GApi', 'GAuth',
  function(GApi, GAuth) {
      var BASE = 'https://quizzcelebrity-149400.appspot.com/_ah/api';
      GApi.load('quizzcelebrityendpoint','v1',BASE).then(function(resp) {
          console.log('api: ' + resp.api + ', version: ' + resp.version + ' loaded');
      }, function(resp) {
          console.log('an error occured during loading api: ' + resp.api + ', resp.version: ' + version);
      });
      
      GAuth.setClient(CLIENT);    
      GAuth.setScope('https://www.googleapis.com/auth/userinfo.profile');
      GAuth.load();
  }
]);

app.controller('QuizzController', ['$scope', 'GApi', 'GAuth', '$cookies', 'GData', function($scope, GApi, GAuth, $cookies, GData){

	$scope.theme = "actor";
	$scope.nbQuestion = 0 ;
	$scope.etatQ = "Qui" ;
	$scope.tabPersonnes;
	$scope.tabReponses;
	$scope.tabTrueFalse;
	$scope.resultat = 0;
	$scope.page = "home";
	$scope.user = null;
	$scope.questionLoaded =false;
	
	// ---------------------------------------  LOG IN / LOG OUT ------------------------------------- // 
	if ($cookies.get("google_id")) {
        GData.setUserId($cookies.get("google_id"));

        GAuth.checkAuth().then(
            function(user) {
                $scope.user = user;
            },
            function() {
                console.log("No user connected yet...");
            }
        )
    }
	
    $scope.login = function() {
        GAuth.login().then(function(user) {
            $scope.user = user;
            $cookies.put("google_id", user.id);
        }, function() {
            console.log("Oups! Failure to connect...");
        });
    };
    
    // Fake logout (cannot change the user, his token isn't destroy yet -> to fix)
    $scope.logout = function() {
        GAuth.logout();
        GData.setUserId(null);
        $scope.user = null;
        $cookies.remove("google_id");
    };
	
    // ------------------------------------------------------------------------------------------------------- // 


	// Méthode pour récupérer la liste des entités
	$scope.loadQuestions = function() {

		if ($scope.questionLoaded == false){
			GApi.execute('quizzcelebrityendpoint','requeteDatastore', {theme:$scope.theme}).then(function(resp) {
	    
			var arr = resp.responseJSON; // on récupère les données du datastore dans un array
			arr = $scope.shuffle(arr); //On mélange l'array	     
	   	 	console.log("LOADQUESTION");
	   		jsonObj.notparsed = JSON.stringify(arr);	     
	   		jsonObj.parsed = JSON.parse(jsonObj.notparsed);
	 		$scope.tabPersonnes = jsonObj.parsed;		// On parse le tout et on met le résultat dans tabPersonnes
	 		console.log($scope.tabPersonnes);
	 		$scope.questionLoaded = true;
	 		$scope.prepareQuestion();

	
	    	}, function() {
	    	    console.log('error :(');
	   		 });
		}
	}
        
		
	/*$scope.play = function() {
		resultat =0;
		nextQuestion();
	}
	
	$scope.nextQuestion = function() {
		if (nbQuestion = 10)
			finDuJeu();
		else
			prepareQuestion();
	}*/
	
	$scope.prepareQuestion = function()
	{
		console.log("PREPARE QUESTION");
		$scope.tabTrueFalse = [false , false, true, false];
		$scope.tabTrueFalse = $scope.shuffle($scope.tabTrueFalse);
		console.log($scope.tabTrueFalse);

		var indexTrue = $scope.tabTrueFalse.findIndex($scope.estTrue);
		console.log("index true = " + indexTrue);

		$scope.tabReponses = [ null, null, null, null ];
		$scope.fillTabReponses(indexTrue);				
		console.log($scope.tabReponses);

		$scope.currentQuestionImage = $scope.tabPersonnes[$scope.nbQuestion].properties.Image;
		$scope.page = "questions" ;
		
	}
	
	
	$scope.estTrue =function(element, index, array) {
 		return element;
 	}
	
	/* TO DO : Changer le "3" en en fonction du nombre de questions, pour 10 questions ça sera 10*/
	$scope.fillTabReponses = function(indexTrue)
	{
		switch($scope.etatQ) {
    		
			case "Qui":
    		
    			$scope.tabReponses[indexTrue] = $scope.tabPersonnes[$scope.nbQuestion].properties.Name;
        		for (var i = 0; i < 4 ; i++) {
	    			if ( i != indexTrue)
						$scope.tabReponses[i] = $scope.tabPersonnes[3+i].properties.Name;
				}
				
       		break;
       		
   			 case "Quand":
   			 
   			 	$scope.tabReponses[indexTrue] = $scope.tabPersonnes[$scope.nbQuestion].properties.Date
  	   	   		for (var i = 0; i < 4 ; i++) {
	    			if (i != indexTrue)
						$scope.tabReponses[i] = $scope.tabPersonnes[3+i].properties.Date;
				}
       		 break;       		 
       		 	
       		 case "Où":
       		  
       		  	$scope.tabReponses[indexTrue] = $scope.tabPersonnes[$scope.nbQuestion].properties.Country;
  	   	   		for (var i = 0; i < 4 ; i++) {
	    			if (i != indexTrue)
						$scope.tabReponses[i] = $scope.tabPersonnes[3+i].properties.Country;
				}
       		 break;
       		 
    		default: 
    			console.log("Default du swith in fillTabResponses");
		}
	
	}
	
	$scope.chooseActor = function(){
		$scope.theme = 'actor';
		$scope.resultat = 0;
		$scope.nbQuestion = 0;
		$scope.loadQuestions();	
	}
	
	
	$scope.chooseMusician = function(){
		$scope.theme = 'musician';
		$scope.loadQuestions();	
	}
	
	/*TO DO : changer le "== 2" en "==10" quand on aura le tabPersonnes rempli à fond ( avec 40 personnes)*/
	$scope.chooseAnswer = function( answer ) {

		if ($scope.tabTrueFalse[answer] == true ){
			$scope.resultat++;
			console.log("OUI C'EST CA!!!!");
		}
		console.log("RESULTAT ="+$scope.resultat);
		$scope.changeEtaQ();
		console.log($scope.etatQ);
		if ($scope.nbQuestion == 2){
			$scope.page = "finDuJeu";
		} else {
			$scope.prepareQuestion()
		}

	}

	$scope.changeEtaQ = function(){

		switch($scope.etatQ) {
    		
			case "Qui":
    			$scope.etatQ = "Quand";
				break;
       		
   			 case "Quand":
   			 	$scope.etatQ = "Où";
   			 	break;       		 
       		 	
       		 case "Où":
       		  	$scope.etatQ = "Qui";
       		  	$scope.nbQuestion++;
       			 break;
       		 
    		default: 
    			console.log("Default du swith in changeEtaQ");
		}

	}


	$scope.openPageHome = function(){
		$scope.page = "home";	
	}
	
	$scope.openPagePlay = function(){
		if(!$cookies.get("google_id"))
			$scope.login();
		
		$scope.page = "play";	
	}
	


	$scope.shuffle =function(array) {
	 	var currentIndex = array.length, temporaryValue, randomIndex;
	
	  	// While there remain elements to shuffle...
	 	while (0 !== currentIndex) {
	
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
		
		   	 // And swap it with the current element.
		   	 temporaryValue = array[currentIndex];
		   	 array[currentIndex] = array[randomIndex];
		  	 array[randomIndex] = temporaryValue;
	 	 }
	
	  	return array;
	}

}]) ;



































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

app.controller('AnswerController2', ['$scope1', 'GApi', function($scope, GApi){
  
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






