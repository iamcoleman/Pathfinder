import {dijkstra, dijkstraGetShortestPathTilesInOrder} from '../algorithms/dijkstra'
import {aStar, aStarGetShortestPathTilesInOrder} from '../algorithms/a_star';
import {recursiveMaze} from '../mazes/recursiveMaze';
import {addDetailsToTable} from './details';

import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

import { Tile } from './tile';


export const TILE_TYPE = {
  'unvisited': 'unvisited',
  'visited': 'visited',
  'wall': 'wall',
  'start': 'start',
  'goal': 'goal'
};

const ALGORITHMS = {
  'dijkstra': 'dijkstra',
  'a_star': 'a_star'
};

function Grid(width, height) {
  this.width = width;
  this.height = height;

  this.gridArray = [];
  this.startTileId = undefined;
  this.goalTileId = undefined;

  this.searchDone = false;
  this.lastRunAlgorithm = undefined;

  this.mouseDown = false;
  this.tileClickedType = undefined;
  this.previousTileClicked = undefined;
  this.previousTileClickedType = undefined;
}

Grid.prototype.initialize = function() {
  this.createGrid();
  this.addEventListeners();
  this.createButtons();
};

/* Create Grid */
Grid.prototype.createGrid = function() {
  const grid = document.getElementById('grid');
  let tableHTML = '';

  // fill grid with tiles
  for (let r = 0; r < this.height; r++) {
    const currentRowTiles = [];
    let currentRowHTML = `<tr id="row-${r}">`;

    for (let c = 0; c < this.width; c++) {
      const newTileId = `tile-${r}-${c}`;

      const newTile = new Tile(newTileId, r, c);

      const startGoalRow = Math.floor(this.height / 2);
      const startTileCol = Math.floor(this.width / 4);
      const goalTileCol = Math.floor(3 * (this.width / 4));
      const newTileClass = (r === startGoalRow && c === startTileCol)
        ? 'tile tile-start'
        : (r === startGoalRow && c === goalTileCol)
        ? 'tile tile-goal'
        : 'tile tile-unvisited';

      if (newTile.row === startGoalRow && newTile.col === startTileCol) {
        newTile.tileType = TILE_TYPE.start;
        newTile.isStart = true;
        this.startTileId = newTile.id;
      }
      if (newTile.row === startGoalRow && newTile.col === goalTileCol) {
        newTile.tileType = TILE_TYPE.goal;
        newTile.isGoal = true;
        this.goalTileId = newTile.id;
      }

      currentRowTiles.push(newTile);
      currentRowHTML += `<td id="${newTileId}" class="${newTileClass}"></td>`;
    }

    this.gridArray.push(currentRowTiles);
    tableHTML += currentRowHTML;
  }

  grid.innerHTML = tableHTML;
};

/*
 *  Event Listeners
 */
Grid.prototype.addEventListeners = function() {
  let grid = this;
  for (let r = 0; r < grid.height; r++) {
    for (let c = 0; c < grid.width; c++) {
      let currTileId = `tile-${r}-${c}`;
      let currTile = grid.getTileFromId(currTileId);
      let currTileElement = document.getElementById(currTileId);

      // onMouseDown
      currTileElement.onmousedown = (e) => {
        e.preventDefault();

        grid.mouseDown = true;
        grid.tileClickedType = currTile.tileType;

        if (!currTile.isStart && !currTile.isGoal) {
          grid.changeNormalTile(currTile);
        } else {
          console.log('onMouseDown - changeSpecialTile()');
          this.changeSpecialTile(currTile);
        }
      };

      // onMouseUp
      currTileElement.onmouseup = (e) => {
        grid.mouseDown = false;

        if (grid.tileClickedType === TILE_TYPE.start) {
          grid.startTileId = currTileId;
        } else if (grid.tileClickedType === TILE_TYPE.goal) {
          grid.goalTileId = currTileId;
        }
      };

      // onMouseEnter
      currTileElement.onmouseenter = (e) => {
        if (grid.mouseDown && !currTile.isStart && !currTile.isGoal) {
          grid.changeNormalTile(currTile);
        } else if (grid.mouseDown && (grid.tileClickedType === TILE_TYPE.goal || grid.tileClickedType === TILE_TYPE.start)) {
          console.log('onMouseEnter - changeSpecialTile()');
          grid.changeSpecialTile(currTile);

          if (grid.tileClickedType === TILE_TYPE.start) {
            grid.startTileId = currTileId;
          } else if (grid.tileClickedType === TILE_TYPE.goal) {
            grid.goalTileId = currTileId;
          }
        }
      };

      // onMouseLeave
      currTileElement.onmouseleave = (e) => {
        if (grid.mouseDown && (grid.tileClickedType === TILE_TYPE.goal || grid.tileClickedType === TILE_TYPE.start)) {
          console.log('onMouseLeave - changeSpecialTile()');
          grid.changeSpecialTile(currTile);
        }
      }
    }
  }
};

// Get Tile from tile ID
Grid.prototype.getTileFromId = function(id) {
  let tileId = id.split('-');
  let row = tileId[1];
  let col = tileId[2];

  return this.gridArray[row][col];
};


/*
 *  Change Tiles
 */
Grid.prototype.changeNormalTile = function(tile) {
  const tileElement = document.getElementById(tile.id);

  if (this.tileClickedType === TILE_TYPE.visited || this.tileClickedType === TILE_TYPE.unvisited) {
    // clicked on normal - change all to normal
    tile.tileType = TILE_TYPE.wall;
    tile.isWall = true;
    tileElement.className = 'tile tile-wall'
  } else if (this.tileClickedType === TILE_TYPE.wall) {
    // clicked on wall - change all to wall
    tile.tileType = TILE_TYPE.unvisited;
    tile.isWall = false;
    tileElement.className = 'tile tile-unvisited';
  }
};

Grid.prototype.changeSpecialTile = function(tile) {
  const tileElement = document.getElementById(tile.id);
  let previousTileElement;

  if (this.previousTileClicked) previousTileElement = document.getElementById(this.previousTileClicked.id);
  console.log(previousTileElement);

  if (tile.tileType !== TILE_TYPE.start && tile.tileType !== TILE_TYPE.goal) {
    console.log('1');
    if (this.previousTileClicked) {
      this.previousTileClicked.tileType = this.previousTileClickedType;
      previousTileElement.className = `tile tile-${this.previousTileClickedType}`;

      this.previousTileClicked = undefined;

      this.previousTileClickedType = tile.tileType;
      tileElement.className = `tile tile-${this.tileClickedType}`;
      tile.tileType = this.tileClickedType;
    }
  } else if (tile.tileType !== this.tileClickedType) {
    console.log('2');
    this.previousTileClicked.tileType = this.tileClickedType;
    previousTileElement.className = `tile tile-${this.tileClickedType}`;
  } else if (tile.tileType === this.tileClickedType) {
    console.log('3');
    // set previousTileClicked to current tile
    this.previousTileClicked = tile;
    tileElement.className = this.previousTileClickedType;
    tile.tileType = this.previousTileClickedType;
  }
};


/*
 *  Create Buttons
 */
Grid.prototype.createButtons = function() {
  // Start Dijkstra
  document.getElementById('startDijkstra').onclick = () => {
    this.lastRunAlgorithm = ALGORITHMS.dijkstra;
    if (this.searchDone) this.clearPath();

    const startTile = this.getTileFromId(this.startTileId);
    const goalTile = this.getTileFromId(this.goalTileId);
    const visitedTilesInOrder = dijkstra(this.gridArray, startTile, goalTile);
    const shortestPathTilesInOrder = dijkstraGetShortestPathTilesInOrder(goalTile);
    this.createDetails(visitedTilesInOrder, shortestPathTilesInOrder);
    this.animateSearch(visitedTilesInOrder, shortestPathTilesInOrder);
  };

  // Start A*
  document.getElementById('startAStar').onclick = () => {
    this.lastRunAlgorithm = ALGORITHMS.a_star;
    if (this.searchDone) this.clearPath();

    const startTile = this.getTileFromId(this.startTileId);
    const goalTile = this.getTileFromId(this.goalTileId);
    const visitedTilesInOrder = aStar(this.gridArray, startTile, goalTile);
    const shortestPathTilesInOrder = aStarGetShortestPathTilesInOrder(goalTile);
    this.createDetails(visitedTilesInOrder, shortestPathTilesInOrder);
    this.animateSearch(visitedTilesInOrder, shortestPathTilesInOrder);
  };

  // Draw Recursive Maze
  document.getElementById('recursiveMaze').onclick = () => {
    this.resetGrid();
    recursiveMaze(this, 2, this.height - 3, 2, this.width - 3, 'vertical', false);
  };

  // Reset Grid
  document.getElementById('resetGrid').onclick = () => {
    this.resetGrid();
  };

  // Clear Path
  document.getElementById('clearPath').onclick = () => {
    this.clearPath();
  };
};

Grid.prototype.resetGrid = function() {
  // Grid Attributes
  this.searchDone = false;

  // Tile Attributes
  for (let row = 0; row < this.height; row++) {
    for (let col = 0; col < this.width; col++) {
      // make unvisited
      this.gridArray[row][col].isVisited = false;
      // make not wall
      this.gridArray[row][col].isWall = false;
      // set distance to Infinity
      this.gridArray[row][col].distance = Infinity;
      // set previous tile to null
      this.gridArray[row][col].previousTile = null;
      // A* values
      this.gridArray[row][col].g_n = Infinity;
      this.gridArray[row][col].h_n = Infinity;
      this.gridArray[row][col].f_n = Infinity;
      // if not start or not goal
      if (!this.gridArray[row][col].isStart && !this.gridArray[row][col].isGoal) {
        // set class to unvisited
        document.getElementById(this.gridArray[row][col].id).className = 'tile tile-unvisited';
      }
    }
  }
};

Grid.prototype.clearPath = function() {
  // Grid Attributes
  this.searchDone = false;

  // Tile Attributes
  for (let row = 0; row < this.height; row++) {
    for (let col = 0; col < this.width; col++) {
      // make unvisited
      this.gridArray[row][col].isVisited = false;
      // set distance to Infinity
      this.gridArray[row][col].distance = Infinity;
      // set previous tile to null
      this.gridArray[row][col].previousTile = null;
      // A* values
      this.gridArray[row][col].g_n = Infinity;
      this.gridArray[row][col].h_n = Infinity;
      this.gridArray[row][col].f_n = Infinity;

      // if not start or not goal
      if (!this.gridArray[row][col].isStart && !this.gridArray[row][col].isGoal && !this.gridArray[row][col].isWall) {
        // set class to unvisited
        document.getElementById(this.gridArray[row][col].id).className = 'tile tile-unvisited';
      }
    }
  }
};


/*
 *  Visualization Functions
 */

// animate Dijkstra's algorithm
Grid.prototype.animateSearch = function(visitedTilesInOrder, shortestPathTilesInOrder) {
  for (let i = 0; i <= visitedTilesInOrder.length; i++) {
    // once all visited tiles have been animated, animate the shortest path
    if (i === visitedTilesInOrder.length) {
      setTimeout(() => {
        this.animatePath(shortestPathTilesInOrder);
      }, 10 * i);
      return;
    }

    // change tile to visited class
    setTimeout(() => {
      const tile = visitedTilesInOrder[i];
      if (!tile.isStart && !tile.isGoal) {
        document.getElementById(tile.id).className = 'tile tile-visited';
      }
    }, 10 * i);
  }
};

// animate the shortest path
Grid.prototype.animatePath = function(shortestPathTilesInOrder) {
  let delay = 0;
  for (const tile of shortestPathTilesInOrder) {
    setTimeout(() => {
      if (!tile.isStart && !tile.isGoal) {
        document.getElementById(tile.id).className = 'tile tile-path';
      }
    }, 50 * delay);

    delay += 1;
  }
  this.searchDone = true;

};


/*
 *  Create details page
 */
Grid.prototype.createDetails = function(visitedTilesInOrder, shortestPathTilesInOrder) {
  const algorithm = this.lastRunAlgorithm === ALGORITHMS.dijkstra ? 'Dijkstra'
    : this.lastRunAlgorithm === ALGORITHMS.a_star ? 'A*'
    : '';

  const exploreLength = visitedTilesInOrder.length;
  const pathLength = shortestPathTilesInOrder.length;

  addDetailsToTable(algorithm, exploreLength, pathLength);
};


/*
 *  Create the Grid on the page
 */
let documentHeight = Math.floor($(document).height() / 30);
let documentWidth = Math.floor($(document).width() / 25);
let newGrid = new Grid(documentWidth, documentHeight);
newGrid.initialize();
