var gameRunning = false;
var wordList;
var tries = 0;
var numOfCorrect = 0;

/**
 * ajax call to get the word bank
 */
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    wordList = this.responseText;
  }
};
xhttp.open("GET", "https://api.datamuse.com/words?ml=anime");
xhttp.send();

/**
 * word - word object that contains the required variables for the hangman game
 */
function word(){
  this.word = "";
  this.score = 0;
  this.tag = "";
  this.numOfLetter = 0;
  this.generate = function(){
    var wordListJSON = JSON.parse(wordList);
    var randomIndex = Math.floor(Math.random() * Math.floor(wordListJSON.length));
    newWord.word = wordListJSON[randomIndex].word.toUpperCase();
  }
}

// creating a new word object
var newWord = new word();

/**
 * newGame - initialize/reset certain variables and objects for a new game
 */
function newGame(){
  var guessText = document.getElementById("guessText");

  // clear the exisiting text
  guessText.innerHTML = "";

  newWord.generate();

  console.log(newWord.word);
  newWord.numOfLetter = 0;

  for(var i = 0; i < newWord.word.length; i++){
    var curChar = newWord.word.charAt(i);
    if(curChar >= "A" && curChar <= "Z"){
      guessText.innerHTML += "_ ";
      newWord.numOfLetter++;
    }else if(curChar == " "){
      guessText.innerHTML += "&nbsp ";
    }else{
      guessText.innerHTML += curChar + " ";
    }
  }

  // reseting variables/objects
  gameRunning = true;
  tries = 0;
  numOfCorrect = 0;
  document.getElementById("hangmanIcon").style.height = 0;
  document.getElementById("hangmanIcon").classList.remove("lost");

  // hide and show the btn
  document.getElementById("guessWord").classList.remove("d-none");
  document.getElementById("newGame").style.display = "none";

  // enable on the onscreen keyboard
  var letterButtons = document.getElementsByClassName("mouse-input-letter");
  for(var i = 0; i < letterButtons.length; i++){
    letterButtons[i].disabled = false;
  }
}

/**
 * gameWon - handles events that happens when user won the game
 */
function gameWon(){
  gameRunning = false;
  modalMsg("You Won!");
  document.getElementById("guessWord").classList.add("d-none");
  document.getElementById("newGame").style.display = "block";
}

/**
 * gameLost - handles events that happens when user lose the game
 */
function gameLost(){
  gameRunning = false;
  modalMsg("You Lost!");
  document.getElementById("guessWord").classList.add("d-none");
  document.getElementById("newGame").style.display = "block";
  document.getElementById("hangmanIcon").classList.add("lost");
}

/**
 * guessLetter - determine whether the user guess the letter correctly and
 *               update the game base on the result
 *
 * @param  {Event} e keypress or mouseclick event
 */
function guessLetter(e){
  var letter;
  var guessText = document.getElementById("guessText").innerText;
  var word = newWord.word;
  var found = false;
  var targetButtonID;

  // get the input from event
  if(e.type == "keypress"){
    letter = String.fromCharCode(e.keyCode).toUpperCase();
  }else if(e.type == "submit"){
    letter = e.innerText;
  }

  // locating the target button and disable it
  targetButtonID = "button" + letter;
  document.getElementById(targetButtonID).disabled = true;

  for(var i = 0; i < word.length; i++){
    var letterIndex = i * 2;
    if(word.charAt(i) == letter){
      guessText = guessText.substr(0, letterIndex) + letter + guessText.substr(letterIndex + 1);
      found = true;
      numOfCorrect++;
    }
  }
  document.getElementById("guessText").innerHTML = guessText;

  // if the inputed text is a hit
  if(!found){
    tries++;
    var height = 20 * tries;
    document.getElementById("hangmanIcon").style.height = height + "%";

    // if excceed 5 tries
    if(tries == 5){
      gameLost();
    }
  }

  if(numOfCorrect == newWord.numOfLetter){
    gameWon();
  }
}

/**
 * guessWord - determine if the user guess the word correctly and update the
 *             game base on whether they are correct or not
 *
 * @param  {String} textInput the word user inputed
 */
function guessWord(textInput){
  if(textInput.toUpperCase() == newWord.word){
    var guessText = document.getElementById("guessText");
    guessText.innerHTML = "";

    for(var i = 0; i < newWord.word.length; i++){
      var curChar = newWord.word.charAt(i);
      guessText.innerHTML += curChar + " ";
    }

    gameWon();
  }else{
    gameLost();
  }
}

/**
 * Generate the on screen keyboard
 */
var mouseInputTarget = document.getElementById("mouseInputButtons");
for(var i = 65; i <= 90; i++){
  var buttonLetter = String.fromCharCode(i);
  var buttonElement = document.createElement("button");
  buttonElement.setAttribute("id", "button" + buttonLetter);
  buttonElement.classList.add("mouse-input-letter");
  buttonElement.innerHTML = buttonLetter;
  buttonElement.disabled = true;
  buttonElement.onclick = function(e){
    var element = this;
    guessLetter(element);
  };
  mouseInputTarget.appendChild(buttonElement);
}

/**
 * guessWord - onclick handler for the "Guess Word" button
 */
document.getElementById("guessWord").onclick = function(){
  modalTextInput(guessWord);
}

/**
 * document - keypress handler when guessing letters using physical keyboard
 *
 * @param  {Event} e the kepress event
 */
document.onkeypress = function(e){
  var modalDisplay = document.getElementsByClassName("modal")[0].style.display;

  if(modalDisplay == "none" || modalDisplay == ""){
    var letter = String.fromCharCode(e.keyCode).toUpperCase();
    var targetButton = document.getElementById("button" + letter);

    if(gameRunning && targetButton != null && !targetButton.disabled){
      guessLetter(e);
    }
  }
}
