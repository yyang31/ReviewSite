/**
Author: Youwei Yang
Description: Handles the game logic for the hangmanReact.html page
*/

// =====================================================================

/**
 * Generate the buttons from 'A' to 'Z' for mouse/touch input. This will
 * also disable the buttons with the letters that was already inputed
 */
class MouseInput extends React.Component {
  /**
   * creates the buttons and disable the buttons with the letters that
   * were already inputed
   * 
   * @returns a list of button elements
   */
  renderButton = () => {
    let buttons = [];

    for (let i = 65; i < this.props.letters.length + 65; i++) {
      let charCode = i + 32;
      let buttonLetter = String.fromCharCode(i);
      let buttonId = "button" + buttonLetter;

      if (this.props.letters[i - 65]) {
        buttons.push(
          <button key={i} id={buttonId} className="mouse-input-letter" onClick={() => this.props.onClick(charCode)} disabled>
            {buttonLetter}
          </button>
        );
      } else {
        buttons.push(
          <button key={i} id={buttonId} className="mouse-input-letter" onClick={() => this.props.onClick(charCode)}>
            {buttonLetter}
          </button>
        );
      }
    }

    return buttons;
  }

  /**
   * render the buttons
   * 
   * @returns a container containing all the buttons
   */
  render() {
    return (
      <div>
        {
          this.renderButton()
        }
      </div>
    );
  }
}

/**
 * display the hangman icon base on the number of tries/attempts
 * 
 * @returns a container containing the hangman icon and pole
 */
function HangmanIcon(props) {
  let curHeight = props.tries * 20;
  let classes = "fas fa-male";

  if (props.tries >= 5) {
    classes = classes + " lost"
  }

  return (
    <div style={{ height: 100 + "%" }}>
      <div id="hangmanPole"></div>
      <i id="hangmanIcon" className={classes} style={{ height: curHeight + "%" }}></i>
    </div>
  );
}

/**
 * Generates a popup message or text input modal
 */
class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    };
  }

  /**
   * update the inputValue state
   */
  updateInputValue(e) {
    this.setState({
      inputValue: e.target.value.toUpperCase()
    });
  }

  /**
   * render the modal if props.show were true; otherwise, return null
   */
  render() {
    let bodyCont = '';
    let btnClassName = "btn";

    if (this.props.type == "message") {
      bodyCont = <span>{this.props.msg}</span>
    } else if (this.props.type == "textInput") {
      bodyCont = <input id="modalTextInputPopup" type="text" placeholder="Guess Word" onChange={(e) => this.updateInputValue(e)} />
      btnClassName += " d-block";
    }

    if (this.props.show) {
      return (
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

    return (null);
  }
}

/**
 * the container containing all the game components
 */
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

  /**
   * adding keypress event to document
   */
  componentDidMount() {
    document.addEventListener("keypress", (e) => this.guessLetter(e.keyCode));
  }

  /**
   * to show or hide a speicific type of modal
   * 
   * @param {boolean} action show or hide the modal
   * @param {string} type message or textInput modal type
   * @param {string} message text to display when generating a message modal
   */
  showModal(action, type, message) {
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

  /**
   * handler function for the onClick action from the modal
   * 
   * @param {string} action close or submit action
   * @param {string} inputReturn the input text returned from the textInput modal
   */
  modalAction(action, inputReturn) {
    if (action == "close") {
      this.showModal(false);
    } else if (action == "submit") {
      if (inputReturn != '') {
        this.guessWord(inputReturn);
      }
    }
  }

  /**
   * handles the on click for 'guess word' button
   */
  guesWordClick() {
    this.showModal(true, "textInput", '');
  }

  /**
   * handles the on click for 'new game' button
   */
  newGameClick() {
    let randomIndex = Math.floor(Math.random() * Math.floor(this.props.wordList.length));
    let newWord = this.props.wordList[randomIndex].word.toUpperCase();
    let letterCount = 0;
    let hiddenWord = "";

    for (var i = 0; i < newWord.length; i++) {
      var curChar = newWord.charAt(i);
      if (curChar >= "A" && curChar <= "Z") {
        hiddenWord += "_ ";
        letterCount++;
      } else if (curChar == " ") {
        hiddenWord += "\u00A0 ";
      } else {
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

  /**
   * display the 'You Won!' message using modal
   */
  gameWonMsg() {
    this.showModal(true, "message", "You Won!");
  }

  /**
   * display the 'You Lost!' message using modal
   */
  gameLostMsg() {
    this.showModal(true, "message", "You Lost!");
  }

  /**
   * game logic when guessing letters
   * 
   * @param {int} keyCode the keyCode of the input
   */
  guessLetter(keyCode) {
    let tries = this.state.numOfTries;

    // if the game is in progress
    if (this.state.inGame && this.state.showModal == false) {
      let upperKeyCode = keyCode - 32;

      // if the key code is between 'A' to 'Z'
      if (upperKeyCode >= 65 && upperKeyCode <= 90) {
        let keyIndex = upperKeyCode - 65;
        let tempKeyPressed = this.state.keyPressed;

        // if the key have not been pressed yet
        if (!tempKeyPressed[keyIndex]) {
          let found = false;
          let tempGameBodyWord = this.state.gameBodyWord;
          let tempNumOfCorrect = this.state.numOfCorrect;
          let tempInGame = this.state.inGame;

          // update the keyPressed state
          tempKeyPressed[keyIndex] = 1;

          // going through the word to locate the letters
          for (var i = 0; i < this.state.word.length; i++) {
            var letterIndex = i * 2;
            if (this.state.word.charAt(i).charCodeAt(0) == upperKeyCode) {
              tempGameBodyWord = tempGameBodyWord.substr(0, letterIndex) + String.fromCharCode(upperKeyCode) + tempGameBodyWord.substr(letterIndex + 1);
              found = true;
              tempNumOfCorrect++;
            }
          }

          // if failed to guess the letter
          if (!found) {
            tries++

            if (tries == 5) {
              tempInGame = false;
            }
          }

          // checking if player won the game
          if (tempNumOfCorrect == this.state.wordLetterCount) {
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

  /**
   * game logic when guessing word
   * 
   * @param {string} word the word the user is trying to guess
   */
  guessWord(word) {
    let tempKeyPressed = this.state.keyPressed;
    let tries = this.state.numOfTries;

    // update the keyPressed with the guessing word
    for (var i = 0; i < word.length; i++) {
      let curKeyCode = word.charAt(i).charCodeAt(0);

      if (curKeyCode >= 65 && curKeyCode <= 90) {
        tempKeyPressed[curKeyCode - 65] = 1;
      }
    }

    // determine win/lose and output appropriate message
    if (word == this.state.word) {
      this.gameWonMsg();
    } else {
      tries = 5;
      this.gameLostMsg();
    }

    setTimeout(
      function () {
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

  /**
   * render all the game components
   */
  render() {
    let gameButton = '';
    if(this.state.inGame){
      gameButton = <button id="guessWord" className="btn" type="button" name="button" onClick={() => this.guesWordClick()}>Guess Word</button>;
    }else{
      gameButton = <button id="newGame" className="btn" type="button" name="button" onClick={() => this.newGameClick()}>New Game</button>;
    }

    return (
      <div>
        <h1>Hangman</h1>
        <div id="hangmanIconCont">
          <HangmanIcon tries={this.state.numOfTries}></HangmanIcon>
        </div>
        <div id="gameBody">
          <div id="guessText">{this.state.gameBodyWord}</div>
        </div>
        <div id="mouseInputButtons">
          <MouseInput letters={this.state.keyPressed} onClick={(e) => this.guessLetter(e)}></MouseInput>
        </div>
        {gameButton}
        <Modal show={this.state.showModal} type={this.state.modalType} msg={this.state.modalMsg} onClick={(action, input) => this.modalAction(action, input)}></Modal>
      </div>
    );
  }
}

/**
 * generate the MainBody container and get the wordlist from the api
 */
class MainCont extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      wordList: []
    };
  }

  /**
   * get the words from the api and update the worldList state
   */
  componentWillMount() {
    if (!this.state.wordList || this.state.wordList.length == 0) {
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

  /**
   * render the MainBody component if the words are loaded from api
   */
  render() {
    const { error, isLoaded, wordList } = this.state;

    if (error) {
      return (
        <div>
          Error: {error.message}
        </div>
      );
    } else if (isLoaded) {
      return (
        <div>
          <div id="mainBody">
            <MainBody wordList={this.state.wordList}>
            </MainBody>
          </div>
        </div>
      );
    } else {
      return (
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
