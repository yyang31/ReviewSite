var gameRunning = false;
var wordList;

// ajax call
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    wordList = this.responseText;
  }
};
xhttp.open("GET", "https://api.datamuse.com/words?ml=duck&sp=b*&max=10", true);
xhttp.send();

// word object
function word(){
  this.word = "";
  this.score = 0;
  this.tag = "";
  this.generate = function(){
    var wordListJSON = JSON.parse(wordList);
    var randomIndex = Math.floor(Math.random() * Math.floor(wordListJSON.length));
    newWord.word = wordListJSON[randomIndex].word.toUpperCase();
  }
}

// creating a new word object
var newWord = new word();

function newGame(){
  var guessText = document.getElementById("guessText");

  // clear the exisiting text
  guessText.innerHTML = "";

  newWord.generate();

  console.log(newWord.word);

  for(var i = 0; i < newWord.word.length; i++){
    var curChar = newWord.word.charAt(i);
    if(curChar >= "A" && curChar <= "Z"){
      guessText.innerHTML += "_ ";
    }else if(curChar == " "){
      guessText.innerHTML += "&nbsp ";
    }else{
      guessText.innerHTML += curChar + " ";
    }
  }

  gameRunning = true;
  tries = 0;
  document.getElementById("hangmanIcon").style.height = 0;

  // hide and show the btn
  document.getElementById("guessWord").classList.remove("d-none");
}

String.prototype.replaceAt=function(index, character) {
      return this.substr(0, index) + character + this.substr(index+character.length);
   }

var tries = 0;
// guessing the letter
function guessLetter(letter){
  var guessText = document.getElementById("guessText").innerText;
  var word = newWord.word;

  var found = false;
  for(var i = 0; i < word.length; i++){
    var letterIndex = i * 2;
    if(word.charAt(i) == letter){
      guessText = guessText.substr(0, letterIndex) + letter + guessText.substr(letterIndex + 1);
      found = true;
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
      gameRunning = false;
      modalError("You Lost!");
    }
  }
}

// guess word
document.getElementById("guessWord").onclick = function(){
  modalError("testing");
}

document.onkeydown = function(e){
  if(gameRunning){
    guessLetter(String.fromCharCode(e.keyCode))
  }
}
