// Initialize firebase
var config = {
    apiKey: "AIzaSyBjF54xtex7E5UWEHeW_sjq1Bso9YigaMw",
    authDomain: "my-first-project-b19e3.firebaseapp.com",
    databaseURL: "https://my-first-project-b19e3.firebaseio.com",
    projectId: "my-first-project-b19e3",
    storageBucket: "my-first-project-b19e3.appspot.com",
    messagingSenderId: "1087687361135"
  };
  
firebase.initializeApp(config);

var database = firebase.database();

// Displays current time
var currentTime = null;

function updateTime() {
	currentTime = moment().format("HH:mm:ss");
	$("#currentTime").html(currentTime);
}

$(document).ready(function() {
	updateTime();
	setInterval(updateTime, 1000);
});

// Adding the train that user inputs
$("#add-train-btn").on("click", function(event) {
	event.preventDefault();

	// User input
	var trainName = $("#train-name-input").val().trim();
	var trainDestination = $("#destination-input").val().trim();
	var trainTime = $("#train-time-input").val().trim();
	var trainFrequency = parseInt($("#frequency-input").val().trim());

	// Local temporary object for storing train data before pushing to firebase
	var newTrain = {
		name: trainName,
		destination: trainDestination,
		time: trainTime,
		frequency: trainFrequency
	};

	// Uploads the train data to the firebase database
	database.ref().push(newTrain);
	console.log(newTrain.name);
	console.log(newTrain.destination);
	console.log(newTrain.time);
	console.log(newTrain.frequency);

	alert("Train successfully added!");

	// Empties the text boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#train-time-input").val("");
	$("#frequency-input").val("");

	// Prevents loading a new page
	return false;
});

function addTrain(childSnapshot) {

	var train = {
		trainName: childSnapshot.val().name,
		trainDestination: childSnapshot.val().destination,
		trainTime: childSnapshot.val().time,
		trainFrequency: childSnapshot.val().frequency,
		minutesAway: 0,
		nextArrival: ""
	}

	// Converts the train time
	var timeConverted = moment(train.trainTime, "HH:mm");
	console.log("Time converted: " + timeConverted);

	// Calculate the difference between first train time and now
	var timeDiff = moment().diff(moment(timeConverted), "minutes");
	console.log("Difference in time: " + timeDiff);

	// Calculate minutes until next train 
	var remainder = timeDiff % train.trainFrequency;
	console.log("Remainder: " + remainder);
	console.log("Train Frequency:" + train.trainFrequency)
	train.minutesAway = train.trainFrequency - remainder;
	console.log("Minutes away: " + train.minutesAway);

	// Calculate next train
	var nextTrain = moment().add(train.minutesAway, "minutes");

	// Arrival time
	train.nextArrival = moment(nextTrain).format("HH:mm");
	console.log("Next arrival: " + train.nextArrival);

	// Add each train's data into the table
	$("#new-train").append("<tr><td>" + train.trainName + "</td><td>" + train.trainDestination + "</td><td>" + "Every " + train.trainFrequency + " min" + "</td><td>" + train.nextArrival + "</td><td>" + train.minutesAway + " min" + "</td></tr>");
}

// Creates firebase event for adding train to database and adds a row to the html
database.ref().on("child_added", function(childSnapshot) {

	addTrain(childSnapshot);

}, function(errorObject) {
	console.log("Errors handled: " + errorObject.code);
});

// Reloads page every minute to update schedule
setInterval(function() {
	location.reload(true);
}, 60000);




