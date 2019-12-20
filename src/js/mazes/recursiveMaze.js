export function recursiveMaze(fullGrid, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }

  if (!surroundingWalls) {
    let relevantIds = [fullGrid.startTileId, fullGrid.goalTileId];

    for (let row = 0; row < fullGrid.height; row++) {
      for (let col = 0; col < fullGrid.width; col++) {
        let tile = fullGrid.gridArray[row][col];
        if (!relevantIds.includes(tile.id)) {
          if (tile.row === 0 || tile.col === 0 || tile.row === fullGrid.height - 1 || tile.col === fullGrid.width - 1) {
            // set to wall
            fullGrid.gridArray[row][col].isWall = true;
            document.getElementById(tile.id).className = 'tile tile-wall';
          }
        }
      }
    }

    surroundingWalls = true;
  }

  if (orientation === "horizontal") {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }

    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }

    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const currentRow = possibleRows[randomRowIndex];
    const colRandom = possibleCols[randomColIndex];

    for (let row = 0; row < fullGrid.height; row++) {
      for (let col = 0; col < fullGrid.width; col++) {
        const tile = fullGrid.gridArray[row][col];
        if (tile.row === currentRow && tile.col !== colRandom && tile.col >= colStart - 1 && tile.col <= colEnd + 1) {
          if (!tile.isStart && !tile.isGoal) {
            // turn to wall
            fullGrid.gridArray[row][col].isWall = true;
            document.getElementById(tile.id).className = 'tile tile-wall';
          }
        }
      }
    }

    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveMaze(fullGrid, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
    } else {
      recursiveMaze(fullGrid, rowStart, currentRow - 2, colStart, colEnd, 'vertical', surroundingWalls);
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveMaze(fullGrid, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls);
    } else {
      recursiveMaze(fullGrid, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', surroundingWalls);
    }
  } else {
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }

    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }

    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentCol = possibleCols[randomColIndex];
    const rowRandom = possibleRows[randomRowIndex];

    for (let row = 0; row < fullGrid.height; row++) {
      for (let col = 0; col < fullGrid.width; col++) {
        const tile = fullGrid.gridArray[row][col];
        if (tile.col === currentCol && tile.row !== rowRandom && tile.row >= rowStart - 1 && tile.row <= rowEnd + 1) {
          if (!tile.isStart && !tile.isGoal) {
            // turn to wall
            fullGrid.gridArray[row][col].isWall = true;
            document.getElementById(tile.id).className = 'tile tile-wall';
          }
        }
      }
    }

    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveMaze(fullGrid, rowStart, rowEnd, colStart, currentCol - 2, 'horizontal', surroundingWalls);
    } else {
      recursiveMaze(fullGrid, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveMaze(fullGrid, rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal', surroundingWalls);
    } else {
      recursiveMaze(fullGrid, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
    }
  }
}