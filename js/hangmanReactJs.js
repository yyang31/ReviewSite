/**
Author: Youwei Yang
Description: Handles the game logic for the hangman.html page
*/

/**
* ajax call to get the word bank
*/

// =====================================================================

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      wordList: []
    };
  }

  componentDidMount() {
    fetch("https://api.datamuse.com/words?ml=anime")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            wordList: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    return (
      <div className="game">
      <div className="game-board">
      </div>
      <div className="game-info">
      </div>
      </div>
    );
  }
}

// =====================================================================

ReactDOM.render(<Game />, document.getElementById("mainCont"));
