export function addDetailsToTable(table, algorithm, explored, path) {
  table.row.add({
    '#': '1',
    'Algorithm': algorithm,
    'Path Length': path,
    'Tiles Explored': explored
  }).draw();
}