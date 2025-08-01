import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import './Board.css';

function createBoard(rows, cols, mines) {
  let board = [];

  // Initial board structure
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      });
    }
    board.push(row);
  }

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      minesPlaced++;
    }
  }

  // Count neighboring mines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 && nr < rows &&
              nc >= 0 && nc < cols &&
              board[nr][nc].isMine
            ) {
              count++;
            }
          }
        }
        board[r][c].neighborMines = count;
      }
    }
  }

  return board;
}

function Board(props) {
  const rows = props.rows   || 9;
  const cols = props.cols   || 9;
  const mines = props.mines || 10;

  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [hasWon, setHasWon] = useState(false);


  // Create the initial board once
  useEffect(function () {
    var newBoard = createBoard(rows, cols, mines);
    setBoard(newBoard);
  }, []);

  // Timer logic using recursive setTimeout (avoiding callbacks)
  useEffect(function () {
    var timerId = null;

    function tick() {
      setTime(time + 1);

      // Keep ticking if game is still active
      if (timerActive && !gameOver) {
        timerId = setTimeout(tick, 1000);
      }
    }

    if (timerActive && !gameOver) {
      timerId = setTimeout(tick, 1000);
    }

    // Cleanup function stops the timer
    return function () {
      clearTimeout(timerId);
    };
  }, [time, timerActive, gameOver]);

  function resetGame() {
    const newBoard = createBoard(rows, cols, mines);
    setBoard(newBoard);
    setGameOver(false);
    setTime(0);
    setTimerActive(true);
  }


  function checkWin(board) {
    for (var r = 0; r < board.length; r++) {
      for (var c = 0; c < board[0].length; c++) {
        if (!board[r][c].isMine && !board[r][c].isRevealed) {
          return false;
        }
      }
    }
    return true;
  }


  function renderTiles() {
    let tiles = [];
    for (let rIndex = 0; rIndex < board.length; rIndex++) {
      let row = board[rIndex];
      for (let cIndex = 0; cIndex < row.length; cIndex++) {
        let tile = row[cIndex];
        tiles.push(
          <Tile
            key={rIndex + '-' + cIndex} // Unique identifier so React can track this tile
            tile={tile}                 // The tiles own data (mine, revealed, flagged)
            row={rIndex}
            col={cIndex}
            board={board}               // Pointer to the board (so tile can look at neighbors)
            setBoard={setBoard}         // Lets tile update board state and trigger re-render
            setGameOver={setGameOver}   // Lets tile declare game over
            checkWin={checkWin}
            setHasWon={setHasWon}
          />
        );
      }
    }
    return tiles;
  }

  let gameMessage = null;
  let messageColor = 'red';

  if (gameOver) {
    if (hasWon) {
      gameMessage = "Success!";
      messageColor = 'green';
    } else {
      gameMessage = "Game Over!";
      messageColor = 'red';
    }
  }

  return (
    <div className="board-container">
      <h1>Minesweeper</h1>
      <h3>Time: {time} s</h3>
      <div className="board-grid" style={{ gridTemplateColumns: `repeat(${cols}, 30px)` }}>
        {renderTiles()}
      </div>
      <div className="message-area">
        {gameOver && (
          <h2 style={{ color: messageColor }}>
            {gameMessage}
          </h2>
        )}
        {gameOver && (
          <button onClick={resetGame} style={{ marginTop: '10px' }}>
            Restart
          </button>
        )}
      </div>
    </div>
  );
}

export default Board;
