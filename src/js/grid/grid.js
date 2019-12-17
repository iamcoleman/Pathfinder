import {dijkstra, getTilesInShortestPathOrder} from '../algorithms/dijkstra'
const Tile = require("./tile");

const START_TILE_ROW = 10;
const START_TILE_COL = 5;
const GOAL_TILE_ROW = 10;
const GOAL_TILE_COL = 25;

function Grid(width, height) {
  this.width = width;
  this.height = height;

  this.gridArray = [];
}

Grid.prototype.initialize = function() {
  this.createGrid();
  this.addEventListeners();
  this.createStartButton();
};

/* Create Grid */
Grid.prototype.createGrid = function() {
  let tableHTML = "";

  // fill grid with nodes
  for (let r = 0; r < this.height; r++) {
    const currentRowTiles = [];
    let currentRowHTML = `<tr id="row ${r}">`;
    for (let c = 0; c < this.width; c++) {
      const newTileId = `tile-${r}-${c}`;

      const newTileClass = (r === START_TILE_ROW && c === START_TILE_COL)
        ? 'start'
        : (r === GOAL_TILE_ROW && c === GOAL_TILE_COL)
        ? 'goal'
        : 'unvisited';

      const newTile = new Tile(newTileId, newTileClass, r, c);
      currentRowTiles.push(newTile);
      currentRowHTML += `<td id="${newTileId}" class="${newTileClass}"></td>`;
    }
    this.gridArray.push(currentRowTiles);
    tableHTML += currentRowHTML;
  }

  let grid = document.getElementById("grid");
  grid.innerHTML = tableHTML;
};

/* Event Listeners */
Grid.prototype.addEventListeners = function() {
  let grid = this;
  for (let r = 0; r < grid.height; r++) {
    for (let c = 0; c < grid.width; c++) {
      let currTileId = `tile-${r}-${c}`;
      let currTile = grid.getTile(currTileId);
      let currTileElement = document.getElementById(currTileId);

      // onMouseDown
      currTileElement.onmousedown = (e) => {
        e.preventDefault();

        grid.changeTile(currTile);
      }
    }
  }
};

/* Get Tile */
Grid.prototype.getTile = function(id) {
  let tileId = id.split('-');
  let row = tileId[1];
  let col = tileId[2];

  return this.gridArray[row][col];
};

/* Change Tile - Normal */
Grid.prototype.changeTile = function(tile) {
  let tileElement = document.getElementById(tile.id);

  // change class on element to unvisited/wall
  tileElement.className = tile.status !== 'wall' ? 'wall' : 'unvisited';
  // change status on tile to unvisited/wall
  tile.status = tileElement.className !== 'wall' ? 'unvisited' : 'wall';
};


/* Create Start Button */
Grid.prototype.createStartButton = function() {
  document.getElementById("startDijkstra").onclick = () => {
    const startTile = this.gridArray[START_TILE_ROW][START_TILE_COL];
    const goalTile = this.gridArray[GOAL_TILE_ROW][GOAL_TILE_COL];
    const visitedTilesInOrder = dijkstra(this.gridArray, startTile, goalTile);
    const tilesInShortestPathOrder = getTilesInShortestPathOrder(goalTile);
    console.log(tilesInShortestPathOrder);
  }
};


/*
 *  Create the Grid on the page
 */
let documentHeight = Math.floor($(document).height() / 30);
let documentWidth = Math.floor($(document).width() / 25);
let newGrid = new Grid(documentWidth, documentHeight);
newGrid.initialize();
