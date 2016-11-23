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

var jsonObj = {
	notparsed: null,
	parsed: null,
};


var resultat;
var stateQ;


app.controller('AnswerController', ['$scope', 'GApi', function($scope, GApi){

		
		$scope.nbQuestion = 0 ;
		$scope.etatQ = "Qui" ;
		$scope.tabPersonnes;
		$scope.tabReponses;
		
		/*Méthode pour récupérer la liste des entités*/
		GApi.execute('quizzcelebrityendpoint','requeteDatastore', {theme:"musician"}).then(function(resp) {
	    
	     var arr = resp.responseJSON;
	     arr = shuffle(arr); //On mélange l'array	     
	     
	     jsonObj.notparsed = JSON.stringify(arr);	     
	     jsonObj.parsed = JSON.parse(jsonObj.notparsed);
	     
     
	     runApp(jsonObj);		
		

        }, function() {
            console.log('error :(');
        });
        
        
        
        function runApp(json)
	{
		$scope.tabPersonnes = json.parsed;
		$scope.tabReponses = [ null, null, null, null ];
		 
		prepareQuestion();
		$scope.funiculaire = json.parsed[0].properties.Name;

	}
	
	
	
	
	function play() 
	{
		
		resultat =0;
		nextQuestion();
	}
	
	
	function nextQuestion()
	{
		if (nbQuestion = 10)
			finDuJeu();
		else
			prepareQuestion();
	}
	
	
	function prepareQuestion()
	{
		var tab = [false , false, true, false];
		tab = shuffle(tab);
		console.log(tab);
		var indexTrue = tab.findIndex(estTrue);
		console.log("index true = " + indexTrue);
		
				
		$scope.tabReponses[indexTrue] = $scope.tabPersonnes[$scope.nbQuestion].properties.Name;
		console.log($scope.tabPersonnes);
		
		fillTabReponses(indexTrue);
		
		console.log($scope.tabReponses);
		$scope.currentQuestionImage = $scope.tabPersonnes[$scope.nbQuestion].properties.Image;
		console.log($scope.currentQuestionImage);
		
		
		

	}
	
	
	function estTrue(element, index, array) {
 		return element;
 	}

	
	
	function fillTabReponses(indexTrue)
	{
	
		switch("Qui") {
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
    			
    			if ( i != indexTrue)
					$scope.tabReponses[i] = $scope.tabPersonnes[3+i].properties.Date;
				}
       		 break;
       		 
       		 
       		 	
       		  case "Où":
       		  
       		  	$scope.tabReponses[indexTrue] = $scope.tabPersonnes[$scope.nbQuestion].properties.Country;
  	   	   		for (var i = 0; i < 4 ; i++) {
    			
    			if ( i != indexTrue)
					$scope.tabReponses[i] = $scope.tabPersonnes[3+i].properties.Country;
				}
       		 break;
       		 
    		default: 
    			console.log("Default du swith in fillTabResponses");
		}
	
	
	
	
	}
	
	function choose(
	

	
	
	
	
	
	
	
	
	
	
	
	
	function shuffle(array) {
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






