/*
  CODE CHALLENGE
*/

app.controller('CodeController', function($scope, $http, $timeout, $cookies, $location, backend, $rootScope) {

  // load data from backend
  var userToken = $cookies.get('token');
  backend.getData(userToken).then(function(userData) {
    var data = userData.data.message;
    if (!data.applicationCompleted) {
      $location.path('/page2');
    }
  });


  $scope.clearConsole = function() {
    document.getElementById("result-log").innerText = '';
  };

  $scope.aceLoaded = function(_editor) {
    _editor.$blockScrolling = Infinity;

    //set content of editor:
    var initialCode = `/*
1) Declare two variables, a string and an integer named "fullName" and "yearBorn". Set them equal to Linus Torvalds's name and the year he was born.
*/




/*
2) Declare an empty array called "myArray". Add the variables from the question above (fullName and yearBorn) to the empty array using the push method. Print to the console to test your result.
*/




/*
3) Write a simple function called "sayHello" that takes no parameters. Make it return "Hello!". Call the function.
*/




/*
4) Declare a variable named splitName and set it equal to fullName split into two seperate elements in an array. (In other words, the variable fullName is equal to "Linus Torvalds", then splitName should equal ["Linus", "Torvalds"].) Print splitName to the console to test your result. HINT: Remember to research the methods and concepts listed in the instructions PDF.
*/




/*
5) Write another function called "sayName" that takes no parameters. When called, this function should return "Hello, [name]!", where the name is equal to the first value in the splitName array from #4. Call the function.
*/




/*
6) Write another function named linusAge.  This function should take one parameter: the year Linus was born, and it should return the implied age. Call the function, passing the year Linus was born as the argument/parameter. HINT: http://www.w3schools.com/js/js_functions.asp
*/




/*
7) Using the basic function given below, add code to return the sum of all the odd numbers from 1 to 5000.  Don't forget to call the function! HINT: Consider using a 'for loop'.
*/

function sum_odd_numbers() {
    var sum = 0;

    // Write your code here


    return sum;
}


// That's it! After you're satisfied, click "Save & Continue"

`;

    if (localStorage.getItem('code')) {
      $scope.code = localStorage.getItem('code');
    } else {
      $scope.code = initialCode;
    }

    // don't display jasmine results, until runCode is executed once
    $scope.showResults = false;

    $scope.runCode = function() {
      var code = _editor.getValue();

      saveLocally(code);

      // replace console.*, alerts, and such with postMessage so that webWorker can communicate back
      code = code.replace(/console.log|console.dir|console.error|alert|window.alert|document.write/g, "postMessage");

      // run client side code in a web worker
      var webWorker;
      var blob;
      var numMessagesReceived = 0;
      var resultLog = document.getElementById("result-log");

      if (typeof(Worker) !== "undefined") { // does the browser support web workers?

        if (typeof(webWorker) == "undefined") { //does webWorker already exist?
          blob = new Blob([code], {type: 'application/javascript'});
          webWorker = new Worker(URL.createObjectURL(blob));
        }

        // print console.log from the user's code to our console
        webWorker.onmessage = function(event) {
          numMessagesReceived++;
          if (numMessagesReceived > 100) {
            resultLog.innerText += '> Possible stack overflow or infinite loop detected. Terminating.\n';
            console.log('Possible stack overflow or infinite loop detected. Terminating.');
            webWorker.terminate();
            webWorker = undefined;
          }
          $timeout(function() {
            resultLog.innerText += '> ' + JSON.stringify(event.data) + '\n';
            console.log(JSON.stringify(event.data));
          }, 100);
        };

        // print any errors that may occur
        webWorker.onerror = function(event) {
          resultLog.innerText += '> ' + JSON.stringify(event.message) + '\n';
          console.log(event.message);
        };

        // terminate webWorker
        $timeout(function() {
          if (typeof(webWorker) !== "undefined") {
            webWorker.terminate();
            webWorker = undefined;
          }
        }, 3000);


      } else {
        // unless they're using Opera, this shouldn't occur
        console.log("Sorry, no web worker support");
      }

      // remind the user if they forgot to console.log()
      $timeout(function() {
        if (resultLog.textContent === "") {
          resultLog.innerText += '> Use console.log() if you want output to display here.\n';
        }
      }, 1000);

      // reload jasmine spec runner
      var ifr = document.getElementById('jasmine');
      ifr.src = ifr.src;

      // don't display results, until runCode is executed once
      $scope.showResults = true;

      // display test results to the user
      $timeout(function() {
        var results = $rootScope.jasmineResults;
        $scope.numCorrect = 0,
        $scope.answers = {
          question1: "Failed",
          question2: "Failed",
          question3: "Failed",
          question4: "Failed",
          question5: "Failed",
          question6: "Failed",
          question7: "Failed"
        };

        results.forEach(function(result) {

          if (result.status === 'passed') {
            $scope.numCorrect++;
            if (result.id === 'spec0') {
              $scope.answers.question1 = "Passed";
            } else if (result.id === 'spec1') {
              $scope.answers.question2 = "Passed";
            } else if (result.id === 'spec2') {
              $scope.answers.question3 = "Passed";
            } else if (result.id === 'spec3') {
              $scope.answers.question4 = "Passed";
            } else if (result.id === 'spec4') {
              $scope.answers.question5 = "Passed";
            } else if (result.id === 'spec5') {
              $scope.answers.question6 = "Passed";
            } else if (result.id === 'spec6') {
              $scope.answers.question7 = "Passed";
            }
          }
        }); // end results.forEach
      }, 500);
    }; // end runCode function



    $scope.saveCode = function() {
      var code = _editor.getValue();

      saveLocally(code);

      var token = $cookies.get('token');

      // reload jasmine spec runner
      var ifr = document.getElementById('jasmine');
      ifr.src = ifr.src;

      $timeout(function() {
        $http.post(API + '/testCodeChallenge', { code: code, token: token, results: $rootScope.jasmineResults })
          .then(function(response) {
            //success
            $location.path('/schedule');
          })
          .catch(function(err) {
            if (err) {
              console.log('There was an error testing the code challenge: ', err);
            }
          });
      }, 1000);

    };
  }; // ends aceLoaded

  function saveLocally(code) {
    // attempt to save code from ACE in localstorage
    if (typeof(Storage) !== "undefined") {
      // if code already exists in localStorage, delete it firstname
      if (localStorage.getItem("code")) {
        localStorage.removeItem("code");
      }
      // Store
      localStorage.setItem("code", code);
    } else {
        // Sorry! No Web Storage support..
        alert('Please use Chrome to complete the code challenge!');
    }
  }

});
