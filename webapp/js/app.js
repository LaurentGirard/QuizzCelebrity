var CLIENT = '770415131518-s2is18ruc36nuo8ukvb5tgk5vm6r95kp.apps.googleusercontent.com';

var app = angular.module('celebrityQuizz', ['angular-google-gapi', 'ngCookies']);

var jsonObj = {
	notparsed: null,
	parsed: null,
};

var resultat;
var stateQ;

app.run(['GApi', 'GAuth', '$rootScope', '$cookies', 'GData',
  function(GApi, GAuth, $rootScope, $cookies, GData) {
      var BASE = 'https://quizzcelebrity-149400.appspot.com/_ah/api';
      GApi.load('quizzcelebrityendpoint','v1',BASE).then(function(resp) {
          console.log('api: ' + resp.api + ', version: ' + resp.version + ' loaded');
      }, function(resp) {
          console.log('an error occured during loading api: ' + resp.api + ', resp.version: ' + version);
      });
      
      GAuth.setClient(CLIENT);    
      GAuth.setScope('https://www.googleapis.com/auth/userinfo.profile');
      GAuth.load();
      
  	// ---------------------------------------  LOG IN / LOG OUT ------------------------------------- // 
  	
      $rootScope.user = null;
      if ($cookies.get("google_id")) {
          GData.setUserId($cookies.get("google_id"));
          GAuth.checkAuth().then(
              function(user) {
                  $rootScope.user = user;
              },
              function() {
                  console.log("No user connected yet...");
              }
          )
      }
  	
      $rootScope.login = function() {
          GAuth.login().then(function(user) {
              $rootScope.user = user;
              $cookies.put("google_id", user.id);
          }, function() {
              console.log("Oups! Failure to connect...");
          });
      };
      
      $rootScope.logout = function() {
          GAuth.logout();
          GData.setUserId(null);
          $rootScope.user = null;
          $cookies.remove("google_id");
      };
  }
]);


app.controller('QuizzController', ['$scope', 'GApi', 'GAuth', '$cookies', 'GData', function($scope, GApi, GAuth, $cookies, GData){
	$scope.theme = "actor";
	$scope.nbQuestion = 0 ;
	$scope.etatQ = "Qui" ;
	$scope.questionShowed = "Qui est cette personne ?";
	$scope.tabPersonnes;
	$scope.tabReponses;
	$scope.tabTrueFalse;
	$scope.resultat = 0;
	$scope.page = "home";
	$scope.questionLoaded =false;
	$scope.displayMap=false;
	$scope.mapLoaded=false;
	$scope.scoreAdded=false;
	
    $scope.timer = {
            percentage: 0,
            rate: 1,
            green: 0,
            orange: 0,
            red: 0,
            id: null,
            start: function() {
                $scope.timer.id = setInterval(function() {
                	if($scope.timer.green < 50)
                		$scope.timer.green += $scope.timer.rate;
                	else if ($scope.timer.orange < 25)
                		$scope.timer.orange += $scope.timer.rate;
                	else if($scope.timer.red < 25)
                		$scope.timer.red += $scope.timer.rate;
                	
                	$scope.timer.percentage = $scope.timer.green + $scope.timer.orange + $scope.timer.red; 
                    $scope.$apply();
                    
                    if ($scope.timer.percentage >= 100)
                        $scope.timer.stop();
                },200);
            },
            stop: function(out) {
                if ($scope.timer.id != null) {
                    clearInterval($scope.timer.id);
                    $scope.timer.id = null;
                    if (out)
                        $scope.$apply();
                }
            },
            init: function(){
            	$scope.timer.green = 0;
            	$scope.timer.orange = 0;
            	$scope.timer.red = 0;
            	$scope.timer.percentage = 0;
            	id = null;
            }
    };
    // ------------------------------------------------------------------------------------------------------- // 


	// Méthode pour récupérer la liste des entités
	$scope.loadQuestions = function() {
		if ($scope.questionLoaded == false){
			GApi.execute('quizzcelebrityendpoint','requeteDatastore', {theme:$scope.theme}).then(function(resp) {
	    
			var arr = resp.responseJSON; // on récupère les données du datastore dans un array
			arr = $scope.shuffle(arr); //On mélange l'array	     
	   		jsonObj.notparsed = JSON.stringify(arr);	     
	   		jsonObj.parsed = JSON.parse(jsonObj.notparsed);
	 		$scope.tabPersonnes = jsonObj.parsed;
	 		$scope.tabPersonnes = $scope.shuffle($scope.tabPersonnes);	// On parse le tout et on met le résultat dans tabPersonnes
	 		$scope.questionLoaded = true;
	 		$scope.prepareQuestion();
	
	    	}, function() {
	    	    console.log('error during loading questions');
	   		 });
		}
	}
        	
	$scope.prepareQuestion = function()
	{
		$scope.timer.stop();
		$scope.tabTrueFalse = [false , false, true, false];
		$scope.tabTrueFalse = $scope.shuffle($scope.tabTrueFalse);

		if ($scope.etatQ == "Où" && $scope.mapLoaded == false) {
            $scope.initMap();
            $scope.mapLoaded = true;
        }

		var indexTrue = $scope.tabTrueFalse.findIndex($scope.estTrue);

		$scope.tabReponses = [ null, null, null, null ];
		$scope.fillTabReponses(indexTrue);				

		$scope.currentQuestionImage = $scope.tabPersonnes[$scope.nbQuestion].properties.Image;
		$scope.page = "questions" ;
		$scope.timer.init();
		$scope.timer.start();
	}
	
	
	$scope.estTrue = function(element, index, array) {
 		return element;
 	}
	
	/* TO DO : Changer le "3" en en fonction du nombre de questions, pour 10 questions ça sera 10*/
	$scope.fillTabReponses = function(indexTrue)
	{
		var j = 3*$scope.nbQuestion;
		var k = 0;

		switch($scope.etatQ) {
    		
			
			case "Qui":
    		
    			$scope.tabReponses[indexTrue] = $scope.tabPersonnes[$scope.nbQuestion].properties.Name;
        		for (var i = 0; i < 4 ; i++) {
	    			if ( i != indexTrue){
						$scope.tabReponses[i] = $scope.tabPersonnes[10+j+k].properties.Name;
						k++;
					}
				}
				
       		break;
       		
   			 case "Quand":   				
   				 
   			 	$scope.tabReponses[indexTrue] = $scope.tabPersonnes[$scope.nbQuestion].properties.Date;
  	   	   		for (var i = 0; i < 4 ; i++) {
	    			if (i != indexTrue){
						$scope.tabReponses[i] = $scope.tabPersonnes[10+j+k].properties.Date;
						k++;
	    			}
					
				}
       		 break;       		 

       		 case "Où":
       		  
       		  	$scope.tabReponses[indexTrue] = $scope.tabPersonnes[$scope.nbQuestion].properties.Country;
  	   	   		for (var i = 0; i < 4 ; i++) {
	    			if (i != indexTrue){
						$scope.tabReponses[i] = $scope.tabPersonnes[10+j+k].properties.Country;
						k++;
	    			}
				}
       		 break;
       		 
    		default: 
		}
	
	}
	

	$scope.changeWritenQuestion = function(){
		switch($scope.etatQ) {
	    		
				case "Qui":
	    		
	    			$scope.questionShowed = "Quelle est sa date de naissance ?";
					
	       		break;
	       		
	   			 case "Quand":
	   			 
	   			 	$scope.questionShowed = "Dans quelle pays est-elle née ?";
	       		 break;       		 
	       		 	
	       		 case "Où":
	       		  
	       		  	$scope.questionShowed = "Qui est cette personne ?";
	       		 break;
	       		 
	    		default: 
	    			console.log("Default du swith in changeWritenQuestion");
			}
	}

	$scope.chooseActor = function(){
		$scope.theme = 'actor';
		$scope.resultat = 0;
		$scope.nbQuestion = 0;
		$scope.questionLoaded = false;
		$scope.scoreAdded=false;
		$scope.loadQuestions();	
	}
	
	$scope.chooseMusician = function(){
		$scope.theme = 'musician';
		$scope.resultat = 0;
		$scope.nbQuestion = 0;
		$scope.questionLoaded = false;
		$scope.scoreAdded=false;
		$scope.loadQuestions();	
	}
	
	$scope.chooseAthlete = function(){
		$scope.theme = 'athlete';
		$scope.resultat = 0;
		$scope.nbQuestion = 0;
		$scope.questionLoaded = false;
		$scope.scoreAdded=false;
		$scope.loadQuestions();	
	}
	
	$scope.chooseAnswer = function( answer ) {
		$scope.timer.stop();
		if ($scope.tabTrueFalse[answer] == true && $scope.timer.percentage < 100){
			$scope.resultat = $scope.resultat + 100 - $scope.timer.percentage;
		}
		$scope.changeWritenQuestion();
		$scope.changeEtaQ();		
		$scope.prepareQuestion()
	}

	$scope.chooseAnswerMap = function(answer)
	{
		switch($scope.tabReponses[$scope.indexTrue]){
		
		case "the United States":
			$scope.tabReponses[$scope.indexTrue] = "United States";
			break;
			
		case "the Philippines":
			$scope.tabReponses[$scope.indexTrue] = "Philippines";
			break;
			
		case "Soviet Union":
			$scope.tabReponses[$scope.indexTrue] = "Russia";
			break;
			
		case "Czechoslovakia":
			$scope.tabReponses[$scope.indexTrue] = "Czech Republic";
			break;
			
		case "Hellenic Republic":
			$scope.tabReponses[$scope.indexTrue] = "Greece";
			break;
			
		case "Austria-Hungary":
			$scope.tabReponses[$scope.indexTrue] = "Austria";
			break;
			
		case "Yugoslavia":
			$scope.tabReponses[$scope.indexTrue] = "Serbia";
			break;	
			
		case "Latvian SSR":
			$scope.tabReponses[$scope.indexTrue] = "Latvia";
			break;
			
		case "Ukrainian SSR":
			$scope.tabReponses[$scope.indexTrue] = "Ukraine";
			break;
			
		case "Byelorussian SSR":
			$scope.tabReponses[$scope.indexTrue] = "Belarus";
			break;
			
		case "West Germany":
			$scope.tabReponses[$scope.indexTrue] = "Germany";
			break;
		
		case "East Germany":
			$scope.tabReponses[$scope.indexTrue] = "Germany";
			break;
			
		case "Burma":
			$scope.tabReponses[$scope.indexTrue] = "Myanmar (Burma)";
			break;
			
		case "Poltava":
			$scope.tabReponses[$scope.indexTrue] = "Ukraine";
			break;
			
		case "Victoria":
			$scope.tabReponses[$scope.indexTrue] = "Australia";
			break;
			
		case "Queensland":
			$scope.tabReponses[$scope.indexTrue] = "Australia";
			break;
		}
		
		if ($scope.tabReponses[$scope.indexTrue] == answer && $scope.timer.percentage < 100){
			$scope.resultat = $scope.resultat + 100 - $scope.timer.percentage;
		}
		
		$scope.changeWritenQuestion();
		$scope.changeEtaQ();
		if ($scope.nbQuestion == 3){
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
   			 	$scope.page = "questionsMap";
   			 	$scope.map_pick = null;
   			 	$scope.displayMap=true;
   			 	break;       		 
       		 	
       		 case "Où":
       		 	$scope.page = "questions";
       		 	$scope.displayMap=false;
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
		$scope.resultat = 0;
		$scope.nbQuestion = 0;
		$scope.etatQ ="Qui";
		$scope.questionShowed = "Qui est cette personne ?";
		$scope.page = "play";
		$scope.timer.stop();
	}
	
	$scope.shuffle = function(array) {
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


			$scope.setMapPick = function(pick) {
            $scope.map_pick = pick;
            $scope.$apply();
        };

        $scope.initMap = function() {
            $scope.map_choice = null;
            var mapCanvas = document.getElementById("map");
            var myCenter= new google.maps.LatLng(31.6341600,-7.9999400);
            var mapOptions = {center: myCenter, zoom: 2};
            var map = new google.maps.Map(mapCanvas, mapOptions);
            var infowindow = new google.maps.InfoWindow();

            function placeMarker(map,infowindow, location, fn) {
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    draggable: true
                });
                var latLng = new google.maps.LatLng(marker.position.lat(),marker.position.lng());

               // infowindow.open(map,marker);
                geocoderLatLng(map,infowindow,latLng);

                google.maps.event.addListener(marker,'dragend', function(event) {
                    latLng = new google.maps.LatLng(marker.position.lat(),marker.position.lng());
                    geocoderLatLng(map,infowindow,latLng);
                });
            };

            function geocoderLatLng(map, infowindow,latLng) {
                var geocoder = new google.maps.Geocoder;
                geocoder.geocode({'location':latLng}, function(results, status) {
                    if(status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            var i = 0;
                            while(results[1].address_components[i].types[0] != "country") {
                                i++;
                            }
                            var country = results[1].address_components[i].long_name;
                            infowindow.setContent(country);
                            $scope.setMapPick(country);
                        } else {
                            console.error('No results found');
                            infowindow.setContent("");
                            $scope.setMapPick(null);
                        }
                    } else {
                        console.error('Geocoder failed due to: ' + status);
                        infowindow.setContent("");
                        $scope.setMapPick(null);
                    }
                });
            };

            google.maps.event.addListenerOnce(map, 'click', function(event) {
                placeMarker(map, infowindow, event.latLng);
            });
        };

    $scope.addScore = function() {
    	if(!$scope.scoreAdded){
    		$scope.scoreAdded=true;
    		if(!$scope.user){
    			$scope.google_id = null;
    			$scope.username = "Anonymous";
    		}else{
    			$scope.google_id = $cookies.get("google_id");
    			$scope.username = $scope.user.name;
    		}
    		
	    	GApi.execute('quizzcelebrityendpoint','insertScoreEntity',{id: Math.floor(Math.random()*1000000)+1, google_id: $scope.google_id, name: $scope.username, score: $scope.resultat}).then(function(resp) {
	    		$scope.openPageHighscores();  
	    	},function(e) {
	     	   console.log('Error during add score!');
	     	   $scope.openPageHome();
	    	  });
	    	
    	}
    	else{
    		console.log("Score déjà ajouté !!");
    	}
   	 };

  $scope.listScores = function(callback) {
    GApi.execute('quizzcelebrityendpoint','listScoreEntity').then(function(resp) {
    	callback(resp.items);
    }, function() {
      console.log('Error during listing scores!');
    });
  };

  $scope.openPageHighscores = function(){
	  $scope.page = "highscores";
      $scope.highscores = null;
      $scope.listScores(function(data) {
        $scope.highscores = data;
      });
  };

}]) ;

