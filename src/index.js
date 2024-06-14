import { gridWidth, gridHeight, clearCanvas, drawBoard, drawPiece } from './tetrisCanvas.js';
import { clearNextCanvas, drawNextPiece } from './nextCanvas.js';

const canvasTetris = document.getElementById('tetrisCanvas');
const nextTetromino = document.getElementById('nextTetromino');
const botonStart = document.getElementById('startTetris');
const gameOver = document.getElementById('gameOver');
gameOver.style.display = 'none';

// Definir el intervalo de tiempo para mover la pieza hacia abajo
let lastTime = 0;
let dropCounter = 0;
const DROPINTERVAL_INI = 500;
let dropInterval = DROPINTERVAL_INI;

// Definir el nivel y los puntos del juego
let totalLines = 0;
let level = 1;
let points = 0;

// Definir la cuadrícula del juego
const board = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));

// Definir las pieza del juego
let piece = null;
let nextPiece = null;

const pieces = [
    {
        x: 3, y: 0, shape: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ], color: 'cyan'
    },
    {
        x: 4, y: 0, shape: [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 0]
        ], color: 'blue'
    },
    {
        x: 4, y: 0, shape: [
            [1, 1, 1],
            [1, 0, 0],
            [0, 0, 0]
        ], color: 'orange'
    },
    {
        x: 4, y: 0, shape: [
            [1, 1],
            [1, 1]
        ], color: 'yellow'
    },
    {
        x: 4, y: 0, shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ], color: 'red'
    },
    {
        x: 4, y: 0, shape: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ], color: 'magenta'
    },
    {
        x: 4, y: 0, shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ], color: 'green'
    },
]

/**
 * Comprueba si la pieza actual colisiona con alguna celda ocupada en la cuadrícula.
 * @returns {boolean} Verdadero si hay una colisión, falso en caso contrario.
 */
function collide() {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if(piece.shape[y][x] && (piece.y + y >= gridHeight || piece.x + x < 0 || piece.x + x >= gridWidth || board[piece.y+y][piece.x + x])) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Genera una nueva pieza aleatoria.
 */
function newPiece() {
    return {...pieces[Math.floor(Math.random() * pieces.length)]};
}

/**
 * Fusiona la pieza actual con la cuadrícula del juego.
 */
function checkLines() {
    let counter = 0;
    for (let y = 0; y < gridHeight; y++) {
        if (board[y].every(value => value)) {
            counter++;
            board.splice(y, 1);
            board.unshift(Array(gridWidth).fill(0));
        }
    }
    addPoints(counter);
}

/**
 * Comprueba si el juego ha terminado.
 */
function checkEndGame() {
    if (board[0].some(value => value)) {
        // alert('Game Over');
        gameOver.style.display = 'block';
        botonStart.style.display = 'block';
        canvasTetris.style.display = 'none';
        nextTetromino.style.display = 'none';
        board.forEach(row => row.fill(0));
        cancelAnimationFrame()
    }
}

function addPoints(row = 0) {
    switch (row) {
        case 0:
            points += 1 * level;
            break;
        case 1:
            points += (10 * level) + 1 * level;
            break;
        case 2:
            points += (25 * level) + 1 * level;
            break;
        case 3:
            points += (40 * level) + 1 * level;
            break;
        case 4:
            points += (60 * level) + 1 * level;
            break;
    }

    document.getElementById('score').innerText = points;
    
    totalLines += row;
    level = Math.floor(totalLines / 10) + 1;
    dropInterval = DROPINTERVAL_INI - ((level-1) * 50);
    document.getElementById('level').innerText = dropInterval;

}

function merge() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[piece.y + y][piece.x + x] = piece.color;
            }
        });
    });
    checkEndGame();
    checkLines();
    drawBoard(board);
    piece = nextPiece;
    nextPiece = newPiece();
    clearNextCanvas();
    drawNextPiece(nextPiece);
}

/**
 * Fusiona la pieza actual con la cuadrícula del juego.
 */
function goDown() {
    piece.y++;
    if(collide()) {
        piece.y--;
        merge();
    }
    else {
        // clearCanvas();
        drawBoard(board);
        drawPiece(piece)
    }
}

/**
 * Actualiza el estado del juego.
 * @param {number} time - Tiempo actual.
 */
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        dropCounter = 0;
        // Mover la pieza hacia abajo
        goDown();
    }
    requestAnimationFrame(update);
}

//escuchar eventos de teclado
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        // Mover la pieza hacia la izquierda
        piece.x--;
        if (collide()) {
            piece.x++;
        }
        drawBoard(board);
        drawPiece(piece);
    } else if (event.key === 'ArrowRight') {
        // Mover la pieza hacia la derecha
        piece.x++;
        if (collide()) {
            piece.x--;
        }
        drawBoard(board);
        drawPiece(piece);
    } else if (event.key === 'ArrowDown') {
        // Mover la pieza hacia abajo
        goDown();
    } else if (event.key === 'ArrowUp') {
        // Girar la pieza
        const shape = piece.shape;
        const N = shape.length - 1;
        const result = shape.map((row, i) => row.map((val, j) => shape[N - j][i]));
        piece.shape = result;
        if (collide()) {
            piece.shape = shape;
        }
        drawBoard(board);
        drawPiece(piece);
    }
});

//evento iniciar juego
document.getElementById('startTetris').addEventListener('click', () => {
    canvasTetris.style.display = 'block';
    nextTetromino.style.display = 'block';
    botonStart.style.display = 'none';
    gameOver.style.display = 'none';
    level = 1;
    points = 0;    
    document.getElementById('score').innerText = points;
    document.getElementById('level').innerText = dropInterval;

    // Dibujar el tablero y la pieza del juego
    clearCanvas();
    clearNextCanvas();
    drawBoard(board);
    piece = newPiece();
    nextPiece = newPiece();
    drawPiece(piece);
    drawNextPiece(nextPiece);

    update();
});





