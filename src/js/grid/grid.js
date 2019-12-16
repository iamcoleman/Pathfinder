const Tile = require("./tile");

function Grid(width, height) {
  this.width = width;
  this.height = height;
}

Grid.prototype.initialize = function() {
  this.createGrid();
};

Grid.prototype.createGrid = function() {
  let tableHTML = "";

  // fill grid with nodes
  for (let r = 0; r < this.height; r++) {
    let currentRowTiles = [];
    let currentRowHTML = `<tr id="row ${r}">`;
    for (let c = 0; c < this.width; c++) {
      let newTileId = `tile-${r}-${c}`;
      let newTileClass = "unvisited";

      newTile = Tile(newTileId, newTileClass);
      currentRowTiles.push(newTile);
      currentRowHTML += `<td id="${newTileId}" class="${newTileClass}"></td>`;
    }
    tableHTML += currentRowHTML;
  }

  let grid = document.getElementById("grid");
  grid.innerHTML = tableHTML;
};



/*
 *  Create the Grid on the page
 */
let documentHeight = Math.floor($(document).height() / 28);
let documentWidth = Math.floor($(document).width() / 25);
let newGrid = new Grid(documentWidth, documentHeight);
newGrid.initialize();
