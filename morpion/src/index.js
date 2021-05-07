import React from 'react';
import ReactDOM from 'react-dom';
import Bounce from 'react-reveal/Bounce';
import Tada from 'react-reveal/Tada';
import './index.css';


function Square(props) {
  // Si le props "estGagnat" renvoie "true", on applique la className "square square--gagnants" afin d'afficher les cases en vert
  // On applique également une animation Tada afin de faire ressortir les cases gagnantes
  if (props.estGagnant) {
    return (<Tada><button className={"square square--gagnants"} onClick={props.onClick}> {props.value} </button></Tada>);
  } else {
    return (<button className={"square"} onClick={props.onClick}> {props.value} </button>);
  }
}

// Début de Board
class Board extends React.Component {
  renderSquare(i) {
    // On determine avec includes, si "estGagnant" est bien présent dans "SquaresGagnants"
    // Si c'est "true" on envoie l'information "estGagnant" à Square↑↑↑↑ afin de changer la className en "square--gagnants"
    return <Square
            estGagnant={this.props.SquaresGagnants.includes(i)}
            key={"square" + i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />;
  }
  render() {
    // Solution
    let board = [];
    for (let row = 0; row < 3; row++) {
      let squares = [];
      for (let square = 0; square < 3; square++) {
        squares.push(this.renderSquare(row * 3 + square));
      }
      board.push(<div key={"row" + row} className="board-row">{squares}</div>);
    }
    return <div>{board}</div>;
  }
}

// Début de Game
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        // position: i,
        selected: {
          row: i % 3 + 1,
          col: Math.floor(i / 3) + 1
        },
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // Création de deux constants pour le gras et le non-gras
    const gras = {
      fontWeight: '800'
    };

    const pasgras = {
      fontWeight: 'normal'
    };
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      // const row = Math.ceil((step.position + 1) / 3);
      // const col = step.position % 3 + 1;
      // const position = "(" + row + " , " + col + ")";

      const desc = move ?
        'Revenir au tour n°' + move + '(ligne: ' + step.selected.row + ' et colonne: ' + step.selected.col + ')' :
        // 'Revenir au tour n°' + move + " " + position :
        'Revenir au début de la partie';
      return (
        <li key={move}>
          {/* Si le stepNumber est true on applique le gras sinon on l'applique pas */}
          <button className='btn' style={this.state.stepNumber === move ? gras : pasgras} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Le joueur ' + winner.winner + ' à gagner la partie.';
    } else {
      status = 'Prochain Joueur: ' + (this.state.xIsNext ? 'X' : 'O');
      if (!winner && this.state.stepNumber === 9){
          status = 'Match Nul !';
      }
    }

    return (
      <div className="game">

        <div className="game-board">
          <Board
            // Si winner vaut "true", donc sa valeur sera winner.WinnerLines sinon si "winner" renvoie "false" cela renvoie un tableau vide
            SquaresGagnants={winner ? winner.WinnerLines : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>

        <div className="game-info">
          <Bounce top>
            <div>{status}</div>
            <ol>{moves}</ol>
          </Bounce>
        </div>

      </div>

    );
  }
}

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // On récuperer les positions gagnantes
      return { 
        winner: squares[a], 
        WinnerLines: lines[i] 
      };
      
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
