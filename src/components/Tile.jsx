import React from 'react';
import './Tile.css';

const bombImgSrc = process.env.PUBLIC_URL + '/assets/bomb-clipart.png';

function Tile({ tile, row, col, board, setBoard, setGameOver }) {

  function revealTile() {
    // Stop if already revealed or flagged
    if (tile.isRevealed || tile.isFlagged) {
      return;
    }

    // Copy the board array to trigger rerender
    var newBoard = board.slice();
    newBoard[row][col].isRevealed = true;

    // Game over if you trigger a mine
    if (tile.isMine) {
      setGameOver(true);          
      revealAll(newBoard);     
    } 
    // If no neighboring mines, reveal connected empty tiles
    else if (tile.neighborMines === 0) {
      revealEmptyTiles(newBoard, row, col);
    }

    setBoard(newBoard);
  }

  function revealAll(board) {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        board[r][c].isRevealed = true;
      }
    }
  }

  function revealEmptyTiles(board, r, c) {
    var directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [ 0, -1],          [ 0, 1],
      [ 1, -1], [ 1, 0], [ 1, 1]
    ];

    for (var i = 0; i < directions.length; i++) {
      var dr = directions[i][0];  // dr = directionsRow
      var dc = directions[i][1];  // dc = directionsCol

      var nr = r + dr;            // nr = neighborRow
      var nc = c + dc;            // nc = neighborCol

      // If the neighbor tile is inside the board, hidden, and not a mine
      if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length &&
          board[nr][nc].isRevealed === false && board[nr][nc].isMine === false) {
        
        board[nr][nc].isRevealed = true;

        // Recursively check neighbor tiles
        if (board[nr][nc].neighborMines === 0) {
          revealEmptyTiles(board, nr, nc);
        }
      }
    }
  }

  function handleRightClick(e) {
    // Stops default browser behavior
    e.preventDefault();

    if (tile.isRevealed) {
      return;
    }

    var newBoard = board.slice();
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
  }

  function getNumberColor(num) {
    switch (num) {
      case 1: return 'blue';
      case 2: return 'green';
      case 3: return 'red';
      case 4: return 'darkblue';
      case 5: return 'brown';
      case 6: return 'turquoise';
      case 7: return 'black';
      case 8: return 'gray';
      default: return 'black';
    }
  }

  let display = '';
  if (tile.isRevealed) {
    if (tile.isMine) {
       display = <img src={bombImgSrc} alt="bomb" style={{ width: '20px', height: '20px' }} />;
    } else if (tile.neighborMines > 0) {
      display = tile.neighborMines;
    }
  } else if (tile.isFlagged) {
    display = '!';
  }

  // Builds a string for CSS classes 
  var tileClass = 'tile';
  if (tile.isRevealed) {
    tileClass += ' revealed';
  } else {
    tileClass += ' hidden';
  }
  if (tile.isFlagged) {
    tileClass += ' flagged';
  }

  return (
    <div
      onClick={revealTile}
      onContextMenu={handleRightClick}
      className={tileClass}
      style={{
        color: getNumberColor(tile.neighborMines),
      }}
    >
      {display}
    </div>
  );
}

export default Tile;
