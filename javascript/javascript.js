// Initialize Firebase
var config = {
    apiKey: "AIzaSyBjCdmfhbGXP7USxCIuWhFUWEXvva0452k",
    authDomain: "train-scheduler-69e14.firebaseapp.com",
    databaseURL: "https://train-scheduler-69e14.firebaseio.com",
    projectId: "train-scheduler-69e14",
    storageBucket: "train-scheduler-69e14.appspot.com",
    messagingSenderId: "377039613518"
};
firebase.initializeApp(config);
// Create a variable to reference the database.
var database = firebase.database();

// Capture Button Click
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();
    console.log("hi")
    // Grabbed values from text boxes
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrain = $("#first-train-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    // Code for handling the push
    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});
database.ref().orderByChild("dateAdded").on("child_added", function (snapshot) {
    var data = snapshot.val();
    var time = moment();
    var tFrequency = data.frequency
    var firstTime = data.firstTrain
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    moment(currentTime).format("hh:mm");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    var minutesAway = tFrequency - tRemainder;
    var nextTrain = moment().add(minutesAway    , "minutes");
    var nextArrival = moment(nextTrain).format("hh:mm");
    var tableRow =
        `
            <tr>
                <th scope="row">${data.name}</th>
                <td>${data.destination}</td>
                <td>${data.frequency}</td>
                <td>${nextArrival}</td>
                <td>${minutesAway}</td>
            </tr>
            `
    $('tbody').append(tableRow);
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

});