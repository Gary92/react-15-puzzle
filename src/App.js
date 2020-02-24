import React from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Header />
      <Game />
    </div>
  );
}

// ======== HEADER ========
function Header() {
  return (
    <div className="header">
      <h1 className="header-title">GIOCO DEL 15</h1>
      <h3 className="header-subtitle">Progetto dimostrativo per la libreria React</h3>
    </div>
  );
}

// ======== GAME ========

class Game extends React.Component {
  constructor(props) {
    super(props);

    const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
    this.state = {
      oldTiles: tiles,
      currentTiles: tiles,
      free: 15,
      moves: 0,
      time: 0
    };
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  updateTime() {
    const time = this.state.time;
    this.setState({ time: time + 1 });
  }

  // Funzione per gestire i click sulle caselle
  handleTileClick(i) {
    const tiles = this.state.currentTiles.slice();
    const moves = this.state.moves;

    if (checkVictory(tiles)) {
      return;
    }

    const free = this.state.free;
    if (Math.abs(i - free) === 1 || Math.abs(i - free) === 4) {
      tiles[free] = tiles[i];
      tiles[i] = null;

      this.setState({
        currentTiles: tiles,
        free: i,
        moves: moves + 1
      });
    }
  }

  // Funzione per iniziare una nuova partita
  handleNewGameClick() {
    const tiles = generateTiles();
    const free = 0,
      moves = 0,
      time = 0;

    this.startTimer();
    this.setState({
      oldTiles: tiles,
      currentTiles: tiles,
      free: free,
      moves: moves,
      time: time
    });
  }

  // Funzione per ricominciare la partita
  handleRestartGameClick() {
    const tiles = this.state.oldTiles;
    const free = 0,
      moves = 0,
      time = 0;

    this.startTimer();
    this.setState({
      currentTiles: tiles,
      free: free,
      moves: moves,
      time: time
    });
  }

  // Funzione di render
  render() {
    const tiles = this.state.currentTiles;
    const moves = this.state.moves;
    const time = this.state.time;
    let status;

    const victory = checkVictory(tiles);
    if (victory) {
      status = moves === 0 ? "idle" : "victory";
      this.stopTimer();
    } else {
      status = "ingame";
    }

    const boardOnClickTile = i => this.handleTileClick(i);
    const menuOnClickNewGame = () => this.handleNewGameClick();
    const menuOnClickRestartGame = () => this.handleRestartGameClick();

    return (
      <div className="game">
        <Info status={status} time={time} moves={moves} />
        <Board tiles={tiles} onClickTile={boardOnClickTile} />
        <Menu
          status={status}
          onClickNewGame={menuOnClickNewGame}
          onClickRestartGame={menuOnClickRestartGame}
        />
      </div>
    );
  }
}

// ======== INFO ========

function Info(props) {
  const timeMinutes = Math.floor(props.time / 60);
  const timeSeconds = props.time % 60;
  const time = timeMinutes + " m " + timeSeconds + " s";

  let message, stats;
  switch (props.status) {
    default:
    case "idle":
      message = "🙂 Riordina le tessere dello schema da 1 a 15.";
      stats = <span>Premi il bottone in basso e inizia una nuova partita.</span>;
      break;
    case "ingame":
      message = "🤔 Sposta le tessere facendo click / tap su di esse.";
      stats = (
        <>
          <span>Tempo: {time}</span>
          <span>Mosse: {props.moves}</span>
        </>
      );
      break;
    case "victory":
      message = "😄 Congratulazioni, ci sei riuscito!";
      stats = (
        <>
          <span>Tempo: {time}</span>
          <span>Mosse: {props.moves}</span>
        </>
      );
      break;
  }

  return (
    <div className="info">
      <div className="info-message">{message}</div>
      <div className="info-stats">{stats}</div>
    </div>
  );
}

// ======== BOARD ========

function Board(props) {
  const tiles = props.tiles,
    onClickTile = props.onClickTile;

  let boardRows = [];
  for (let i = 0; i < 4; i++) {
    let children = [];
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;

      children.push(
        <BoardTile key={index} value={tiles[index]} onClick={() => onClickTile(index)} />
      );
    }

    boardRows.push(
      <div key={i} className="board-row">
        {children}
      </div>
    );
  }

  return <div className="board">{boardRows}</div>;
}

// ======== BOARD TILE ========

function BoardTile(props) {
  let visible = "",
    tileOdd = "";

  if (props.value === null) {
    visible = "hidden";
  } else {
    const tilePosition = props.value - 1; // posizione della casella nello schema
    const rowOdd = Math.trunc(tilePosition / 4) % 2 === 1 ? true : false;

    if (rowOdd) {
      tileOdd = props.value % 2 === 1 ? "tile-odd" : "";
    } else {
      tileOdd = props.value % 2 === 1 ? "" : "tile-odd";
    }
  }

  const className = "tile" + " " + tileOdd + " " + visible;

  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// ======== MENU ========

function Menu(props) {
  const labelNew = "Nuova partita",
    onClickNewGame = props.onClickNewGame;
  const labelRestart = "Ricomincia partita",
    onClickRestartGame = props.onClickRestartGame;

  const buttons = (
    <>
      <MenuButton label={labelNew} onClick={onClickNewGame} />
      {props.status !== "idle" ? (
        <MenuButton label={labelRestart} onClick={onClickRestartGame} />
      ) : null}
    </>
  );

  return <div className="menu">{buttons}</div>;
}

// ======== MENU BUTTON ========

function MenuButton(props) {
  return (
    <button className="menu-button" onClick={props.onClick}>
      {props.label}
    </button>
  );
}

// ========================================

// Funzione per verificare la condizione di vittoria
function checkVictory(tiles) {
  let victory = true;

  for (let i = 0; i < 15; i++) {
    if (tiles[i] !== i + 1) {
      victory = false;
    }
  }

  return victory;
}

// Funzione per generare uno schema
function generateTiles() {
  const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  // Genera una sequenza in ordine casuale
  let i, j, t;
  for (i = tiles.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1)); // indice casuale da 0 a i

    t = tiles[i];
    tiles[i] = tiles[j];
    tiles[j] = t;
  }

  // Se il numero di inversioni di ordinamento non è dispari, esegui uno swap di correzione
  let odd = countInversionsNumber(tiles) % 2 === 1 ? true : false;
  if (!odd) {
    t = tiles[0];
    tiles[0] = tiles[1];
    tiles[1] = t;
  }

  return [null].concat(tiles);
}

// Funzione per contare le inversioni necessarie a risolvere uno schema
function countInversionsNumber(tiles) {
  let count = 0;

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) count++;
    }
  }

  return count;
}
