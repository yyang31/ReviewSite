function word(){
  this.word = "";
  this.score = 0;
  this.tag = "";

  this.generate = function(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var wordList = this.responseText;
        var wordListJSON = JSON.parse(wordList);
        var randomIndex = Math.floor(Math.random() * Math.floor(wordListJSON.length));
        newWord.word = wordListJSON[randomIndex].word;
      }
    };
    xhttp.open("GET", "https://api.datamuse.com/words?ml=duck&sp=b*&max=10", true);
    xhttp.send();
  }
}

// creating a new word object
var newWord = new word();
newWord.generate();

function newGame(){
  var guessText = document.getElementById("guessText");

  // clear the exisiting text
  guessText.innerHTML = "";

  newWord.generate();
  
  for(var i = 0; i < newWord.word.length ; i++){
    guessText.innerHTML += "_ ";
  }
}

window.load = function(){

}
