/**
Author: Youwei Yang
Description: Handles the game logic for the hangman.html page
*/

// =====================================================================

class MouseInput extends React.Component {
  renderButton = () => {
    let buttons = [];

    for(let i = 65; i < this.props.letters.length + 65; i++){
      let charCode = i + 32;
      let buttonLetter = String.fromCharCode(i);
      let buttonId = "button" + buttonLetter;

      if(this.props.letters[i - 65]){
        buttons.push(
          <button key={i} id={buttonId} className="mouse-input-letter" onClick = {() => this.props.onClick(charCode)} disabled>
            {buttonLetter}
          </button>
        );
      }else{
        buttons.push(
          <button key={i} id={buttonId} className="mouse-input-letter" onClick = {() => this.props.onClick(charCode)}>
            {buttonLetter}
          </button>
        );
      }
    }

    return buttons;
  }

  render(){
    return(
      <div>
        {
          this.renderButton()
        }
      </div>
    );
  }
}

class GameBody extends React.Component{
  render(){
    return(
      <div id="guessText">{this.props.guessText}</div>
    );
  }
}

class HangmanIcon extends React.Component {
  render(){
    let curHeight = this.props.tries * 20;
    let classes = "fas fa-male";

    if(this.props.tries >= 5){
      classes = classes + " lost"
    }

    return(
      <div style={{height : 100 + "%"}}>
        <div id="hangmanPole"></div>
        <i id="hangmanIcon" className={classes} style={{height : curHeight + "%"}}></i>
      </div>
    );
  }
}

function GuessWord(props) {
  // if game IS in progress
  if(props.inGame){
    return(
      <button id="guessWord" className="btn" type="button" name="button" onClick={props.onClick}>Guess Word</button>
    );
  }

  return(null);
}

function NewGame(props) {
  // if game is NOT in progress
  if(!props.inGame){
    return(
      <button id="newGame" className="btn" type="button" name="button" onClick={props.onClick}>New Game</button>
    );
  }

  return(null);
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
  }

  updateInputValue(e){
    this.setState({
      inputValue: e.target.value.toUpperCase()
    });
  }

  render(){
    let bodyCont = '';
    let btnClassName = "btn";

    if(this.props.type == "message"){
      bodyCont = <span>{this.props.msg}</span>
    }else if(this.props.type == "textInput"){
      bodyCont = <input id="modalTextInputPopup" type="text" placeholder="Guess Word" onChange={(e) => this.updateInputValue(e)} />
      btnClassName += " d-block";
    }

    if(this.props.show){
      return(
        <div className="modal d-block o-1">
          <div className="modalCont">
            <div className="modal-body">
              {bodyCont}
            </div>
            <div className="modal-close" onClick={() => this.props.onClick("close", "")}>
              <i className="fas fa-times"></i>
            </div>
            <button id="modalBtn" className={btnClassName} onClick={() => this.props.onClick("submit", this.state.inputValue)}>Submit</button>
          </div>
        </div>
      );
    }

    return(null);
  }
}

class MainBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: null,
      wordLetterCount: 0,
      gameBodyWord: null,
      numOfCorrect: 0,
      numOfTries: -1,
      keyPressed: [],
      inGame: false,
      showModal: false,
      modalType: '',
      modalMsg: ''
    };
  }

  // adding keypress event to document
  componentDidMount(){
    document.addEventListener("keypress", (e) => this.guessLetter(e.keyCode));
  }

  // to show or hide the modal
  showModal(action, type, message){
    this.setState({
      word: this.state.word,
      wordLetterCount: this.state.wordLetterCount,
      gameBodyWord: this.state.gameBodyWord,
      numOfCorrect: this.state.numOfCorrect,
      numOfTries: this.state.numOfTries,
      keyPressed: this.state.keyPressed,
      inGame: this.state.inGame,
      showModal: action,
      modalType: type,
      modalMsg: message
    });
  }

  modalAction(action, inputReturn){
    if(action == "close"){
      this.showModal(false);
    }else if(action == "submit"){
      if(inputReturn != ''){
        this.guessWord(inputReturn);
      }
    }
  }

  // handles the on click for 'guess word' button
  guesWordClick(){
    this.showModal(true, "textInput", '');
  }

  // handles the on click for 'new game' button
  newGameOnClick(){
    let randomIndex = Math.floor(Math.random() * Math.floor(this.props.wordList.length));
    let newWord = this.props.wordList[randomIndex].word.toUpperCase();
    let letterCount = 0;
    let hiddenWord = "";

    for(var i = 0; i < newWord.length; i++){
      var curChar = newWord.charAt(i);
      if(curChar >= "A" && curChar <= "Z"){
        hiddenWord += "_ ";
        letterCount++;
      }else if(curChar == " "){
        hiddenWord += "\u00A0 ";
      }else{
        hiddenWord += curChar + " ";
      }
    }

    // resetting the state
    this.setState({
      word: newWord,
      wordLetterCount: letterCount,
      gameBodyWord: hiddenWord,
      numOfCorrect: 0,
      numOfTries: 0,
      keyPressed: Array(26).fill(0),
      inGame: true,
      showModal: false,
      modalMsg: ''
    });

    console.log(newWord);
  }

  gameWonMsg(){
    this.showModal(true, "message", "You Won!");
  }

  gameLostMsg(){
    this.showModal(true, "message", "You Lost!");
  }

  // handle the game logic when guessing letters
  guessLetter(keyCode){
    let tries = this.state.numOfTries;

    // if the game is in progress
    if(this.state.inGame && this.state.showModal == false){
      let upperKeyCode = keyCode - 32;

      // if the key code is between 'A' to 'Z'
      if(upperKeyCode >= 65 && upperKeyCode <= 90){
        let keyIndex = upperKeyCode - 65;
        let tempKeyPressed = this.state.keyPressed;

        // if the key have not been pressed yet
        if(!tempKeyPressed[keyIndex]){
          let found = false;
          let tempGameBodyWord = this.state.gameBodyWord;
          let tempNumOfCorrect = this.state.numOfCorrect;
          let tempInGame = this.state.inGame;

          // update the keyPressed state
          tempKeyPressed[keyIndex] = 1;

          // going through the word to locate the letters
          for(var i = 0; i < this.state.word.length; i++){
            var letterIndex = i * 2;
            if(this.state.word.charAt(i).charCodeAt(0) == upperKeyCode){
              tempGameBodyWord = tempGameBodyWord.substr(0, letterIndex) + String.fromCharCode(upperKeyCode) + tempGameBodyWord.substr(letterIndex + 1);
              found = true;
              tempNumOfCorrect++;
            }
          }

          // if failed to guess the letter
          if(!found){
            tries++

            if(tries == 5){
              tempInGame = false;
            }
          }

          // checking if player won the game
          if(tempNumOfCorrect == this.state.wordLetterCount){
            tempInGame = false;
            this.gameWonMsg();
          }

          // update the state
          // the timeout is needed to give us time to display the modal
          this.setState({
            word: this.state.word,
            wordLetterCount: this.state.wordLetterCount,
            gameBodyWord: tempGameBodyWord,
            numOfCorrect: tempNumOfCorrect,
            numOfTries: tries,
            keyPressed: tempKeyPressed,
            inGame: tempInGame,
            showModal: this.state.showModal,
            modalType: this.state.modalType,
            modalMsg: this.state.modalMsg
          });
        }
      }
    }
  }

  // handle the game logic when guessing word
  guessWord(word){
    let tempKeyPressed = this.state.keyPressed;
    let tries = this.state.numOfTries;

    // update the keyPressed with the guessing word
    for(var i = 0; i < word.length; i++){
      let curKeyCode = word.charAt(i).charCodeAt(0);

      if(curKeyCode >= 65 && curKeyCode <= 90){
        tempKeyPressed[curKeyCode - 65] = 1;
      }
    }

    // determine win/lose and output appropriate message
    if(word == this.state.word){
      this.gameWonMsg();
    }else{
      tries = 5;
      this.gameLostMsg();
    }

    setTimeout(
      function(){
        this.setState({
          word: this.state.word,
          wordLetterCount: this.state.wordLetterCount,
          gameBodyWord: this.state.word,
          numOfCorrect: this.state.numOfCorrect,
          numOfTries: tries,
          keyPressed: tempKeyPressed,
          inGame: false,
          showModal: this.state.showModal,
          modalType: this.state.modalType,
          modalMsg: this.state.modalMsg
        });
      }
      .bind(this),
      100
    );
  }

  render(){
    return(
      <div>
        <h1>Hangman</h1>
        <div id="hangmanIconCont">
          <HangmanIcon tries = {this.state.numOfTries}></HangmanIcon>
        </div>
        <div id="gameBody">
          <GameBody guessText = {this.state.gameBodyWord}></GameBody>
        </div>
        <div id="mouseInputButtons">
          <MouseInput letters = {this.state.keyPressed} onClick = {(e) => this.guessLetter(e)}></MouseInput>
        </div>
        <GuessWord inGame = {this.state.inGame}  onClick={() => this.guesWordClick()}></GuessWord>
        <NewGame inGame = {this.state.inGame} onClick={() => this.newGameOnClick()}></NewGame>
        <Modal show = {this.state.showModal} type = {this.state.modalType} msg = {this.state.modalMsg} onClick={(action, input) => this.modalAction(action, input)}></Modal>
      </div>
    );
  }
}

class MainCont extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      wordList: []
    };
  }

  componentWillMount() {
    if(!this.state.wordList || this.state.wordList.length == 0){
      fetch("https://api.datamuse.com/words?ml=anime")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            error: null,
            isLoaded: true,
            wordList: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error
          });
        }
      )
    }
  }

  render() {
    const { error, isLoaded, wordList } = this.state;

    if(error){
      return (
        <div>
          Error: {error.message}
        </div>
      );
    }else if(isLoaded){
      return (
        <div>
          <div id="mainBody">
            <MainBody wordList = {this.state.wordList}>
            </MainBody>
          </div>
        </div>
      );
    }else{
      return(
        <div>
          <div id="mainBody">
            Loading...
          </div>
        </div>
      );
    }
  }
}

// =====================================================================

ReactDOM.render(<MainCont />, document.getElementById("mainCont"));
