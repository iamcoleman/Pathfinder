function Tile(id, status, row, col) {
  this.id = id;
  this.status = status;
  this.row = row;
  this.col = col;

  // path finding
  this.isVisited = false;
  this.isStart = false;
  this.isGoal = false;

  // distances
  this.distance = Infinity;
}

module.exports = Tile;
