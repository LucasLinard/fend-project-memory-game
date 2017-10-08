// Start Game
let gameStarted = false;

//DOM Elements
let deck = $(".deck");
let list = $(".deck").children().toArray();
let stars = $(".stars");
let restartButton = $(".restart");
let moves = $(".moves");

// VARIABLES
let starCount;
let starScore;
let items = shuffle(list);
let count;
let matches = 0;
let openedCards;
let resetPair = false;

function startGame() {
    gameStarted = false;
    chronoReset();
    chronoStop();
    count = 0;
    starCount = 0;
    starScore = 3;
    items = shuffle(list);
    matches = 0;
    openedCards = [0,0];
    resetPair= true;
    moves.text("0");

    // Empty deck
    deck.empty();

    // Iterate through the array and append each item to the list
    for (let item of items) {
        $(item).removeClass("open show match");
        deck.append(item);
    }
}

startGame();

restartButton.on('click', function () {
    startGame();
});

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Set up event delegation to list item
deck.on('click', 'li', function() {

    if (!gameStarted) {
        gameStarted = true;
        chronoStart();
    }

    let currentCardClass = $(this).attr("class");
    if (currentCardClass == "card") {
        flipCard(this);
        addToOpenedCards(this);
    }

});
function flipCard(item) {
    $(item).toggleClass("open show");
}
function matchCard(item) {
    $(item).toggleClass("match");
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that plays again
var btn = document.getElementById("play-again");

// When the user clicks on <span> (x), close the modal
btn.onclick = function() {
    modal.style.display = "none";
    startGame();
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function addToOpenedCards(card) {
    if (resetPair) {
        flipCard(openedCards[0]);
        flipCard(openedCards[1]);
        openedCards = [0,0];
        resetPair = false;
    }
    if (!openedCards[0]) {
        openedCards[0] = card;
    } else {
        count++;
        starCount++;
        if (starCount > 12 && starScore > 0 ) {
            stars.children("li:first").remove();
            starScore--;
            starCount = 0;
        }
        moves.text(count);
        openedCards[1] = card;
        if ($(openedCards[0]).children("i").attr("class") == $(openedCards[1]).children("i").attr("class")) {
            matchCard(openedCards[0]);
            matchCard(openedCards[1]);
            matches++;
            resetPair = false;
            if (matches == 8) {
                chronoStop();
                document.getElementById("end-time").innerHTML = time
                document.getElementById("end-moves").innerHTML = count + " moves"
                document.getElementById("end-stars").innerHTML = starScore + " stars."
                modal.style.display = "block";
            }
        } else {
            resetPair = true;
        }
    }
}

let time
// time functions
var startTime = 0
var start = 0
var end = 0
var diff = 0
var timerID = 0
function chrono(){
    end = new Date()
    diff = end - start
    diff = new Date(diff)
    var msec = diff.getMilliseconds()
    var sec = diff.getSeconds()
    var min = diff.getMinutes()
    if (min < 10){
        min = "0" + min
    }
    if (sec < 10){
        sec = "0" + sec
    }
    if(msec < 10){
        msec = "00" +msec
    }
    else if(msec < 100){
        msec = "0" +msec
    }
    time = min + ":" + sec + ":" + msec
    document.getElementById("chronotime").innerHTML = time
    timerID = setTimeout("chrono()", 10)
}
function chronoStart(){
    start = new Date()
    chrono()
}

function chronoStop(){
    clearTimeout(timerID)
}
function chronoReset(){
    document.getElementById("chronotime").innerHTML = "00:00:000"
    start = new Date()
}