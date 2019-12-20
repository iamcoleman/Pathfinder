import {dijkstra, dijkstraGetShortestPathTilesInOrder} from '../algorithms/dijkstra'
import {aStar, aStarGetShortestPathTilesInOrder} from "../algorithms/a_star";

const Tile = require("./tile");

const TILE_TYPE = {
  'unvisited': 'unvisited',
  'visited': 'visited',
  'wall': 'wall',
  'start': 'start',
  'goal': 'goal'
};

function Grid(width, height) {
  this.width = width;
  this.height = height;

  this.gridArray = [];
  this.startTileId = undefined;
  this.goalTileId = undefined;

  this.searchDone = false;

  this.mouseDown = false;
  this.tileClicked = undefined;
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
        newTile.isStart = true;
        this.startTileId = newTile.id;
      }
      if (newTile.row === startGoalRow && newTile.col === goalTileCol) {
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
        grid.tileClicked = (currTile.isStart)
          ? TILE_TYPE.start
          : (currTile.isGoal)
          ? TILE_TYPE.goal
          : (currTile.isWall)
          ? TILE_TYPE.wall
          : (currTile.isVisited)
          ? TILE_TYPE.visited
          : TILE_TYPE.unvisited;

        if (!currTile.isStart && !currTile.isGoal) {
          grid.changeNormalTile(currTile);
        }
      };

      // onMouseUp
      currTileElement.onmouseup = (e) => {
        grid.mouseDown = false;
      };

      // onMouseEnter
      currTileElement.onmouseenter = (e) => {
        if (grid.mouseDown && !currTile.isStart && !currTile.isGoal) {
          grid.changeNormalTile(currTile);
        }
      };

      // onMouseLeave
      currTileElement.onmouseleave = (e) => {
        //
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

  if (this.tileClicked === TILE_TYPE.visited || this.tileClicked === TILE_TYPE.unvisited) {
    // change all to normal
    tile.isWall = true;
    tileElement.className = 'tile tile-wall'
  } else if (this.tileClicked === TILE_TYPE.wall) {
    // change all to wall
    tile.isWall = false;
    tileElement.className = 'tile tile-unvisited';
  }
};


/*
 *  Create Buttons
 */
Grid.prototype.createButtons = function() {
  // Start Dijkstra
  document.getElementById('startDijkstra').onclick = () => {
    if (this.searchDone) {
      this.clearPath();
    }
    const startTile = this.getTileFromId(this.startTileId);
    const goalTile = this.getTileFromId(this.goalTileId);
    const visitedTilesInOrder = dijkstra(this.gridArray, startTile, goalTile);
    const shortestPathTilesInOrder = dijkstraGetShortestPathTilesInOrder(goalTile);
    this.animateSearch(visitedTilesInOrder, shortestPathTilesInOrder);
  };

  // Start A*
  document.getElementById('startAStar').onclick = () => {
    if (this.searchDone) this.clearPath();

    const startTile = this.getTileFromId(this.startTileId);
    const goalTile = this.getTileFromId(this.goalTileId);
    const visitedTilesInOrder = aStar(this.gridArray, startTile, goalTile);
    const shortestPathTilesInOrder = aStarGetShortestPathTilesInOrder(goalTile);
    this.animateSearch(visitedTilesInOrder, shortestPathTilesInOrder);
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
 *  Create the Grid on the page
 */
let documentHeight = Math.floor($(document).height() / 30);
let documentWidth = Math.floor($(document).width() / 25);
let newGrid = new Grid(documentWidth, documentHeight);
newGrid.initialize();
