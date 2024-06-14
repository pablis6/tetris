// Obtener el elemento canvas del DOM
const canvas = document.getElementById('nextTetrominoCanvas');
const context = canvas.getContext('2d');

// Definir el tamaño de la cuadrícula del siguiente tetrimonio
const gridWidth = 4;
const gridHeight = 4;
const blockSize = 30;
canvas.width = gridWidth * blockSize;
canvas.height = gridHeight * blockSize
context.scale(1, 1);

// Limpiar el canvas
function clearNextCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// Dibujar un bloque en el canvas
function drawBlock(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  context.strokeStyle = 'black';
  context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

// Dibujar el tablero del juego
function drawBoard(board) {
  context.fillStyle = 'black';
  context.fillRect(0, 0, gridWidth * blockSize, gridHeight * blockSize);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(x, y, value);
      }
    });
  });
}

// Dibujar la siguiente pieza que se juagrá
function drawNextPiece(piece) {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(x, y, piece.color);
      }
    });
  });
}

// Exportar las funciones y variables necesarias
export { canvas, context, gridWidth, gridHeight, blockSize, clearNextCanvas, drawBlock, drawBoard, drawNextPiece };