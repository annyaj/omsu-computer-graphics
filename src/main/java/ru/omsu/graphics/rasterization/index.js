const canvas = document.getElementById('rasterCanvas');
const context = canvas.getContext('2d');
const imageData = context.createImageData(canvas.width, canvas.height);

// Представление всех ячеек
const cells = [];
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let cellWidth = 20;
let cellHeight = 20;
const cellsInRow = Math.floor(canvasWidth / cellWidth);
const cellsInColumn = Math.floor(canvasHeight / cellHeight);

window.onload = () => {
    drawGreed();
}

const drawGreed = () => {
    for (let top = 0; top < canvasHeight; top += cellHeight) {
        for (let left = 0; left < canvasWidth; left += cellWidth) {
            let cell = {
                top: top,
                left: left,
                solid: false,
                fill: function (solid, color) {
                    this.solid = solid;
                    context.fillStyle = color;
                    context.fillRect(this.left, this.top, cellWidth, cellHeight);
                },
                drawBorder: function () {
                    context.beginPath();
                    context.strokeStyle = 'black';
                    context.moveTo(this.left - 0.5, this.top - 0.5);
                    context.lineTo(this.left - 0.5 + cellWidth, this.top - 0.5);
                    context.lineTo(this.left + cellWidth - 0.5, this.top + cellHeight - 0.5);
                    context.lineTo(this.left - 0.5, this.top + cellHeight - 0.5);
                    context.lineTo(this.left - 0.5, this.top - 0.5);
                    context.stroke();
                }
            };

            cells.push(cell);
            cell.fill(true, 'white');
            cell.drawBorder();
        }
    }
}

function getCellByPosition(left, top) {
    let topIndex = Math.floor(top / cellHeight) * cellsInRow;
    let leftIndex = Math.floor(left / cellWidth);
    return cells[topIndex + leftIndex];
}

// Взаимодействие
let filling = true;
let startPos = {
    startX: 0,
    startY: 0
};

function fillCellAtPosition(x, y, fillingMode) {
    let cellUnderCursor = getCellByPosition(x, y);
    cellUnderCursor.fill(fillingMode, 'green');
    cellUnderCursor.drawBorder();
}

function handleMouseDown(event) {
    startPos.startX = getCellByPosition(event.clientX, event.clientY).left;
    startPos.startY = getCellByPosition(event.clientX, event.clientY).top;
    fillCellAtPosition(event.clientX, event.clientY, filling);

    canvas.onmousemove = (event) => handleMouseMove(event);
}

function handleMouseUp(event) {
    let cell = getCellByPosition(event.clientX, event.clientY);
    line(startPos.startX, startPos.startY, cell.left, cell.top);

    canvas.onmousemove = () => {
    };
}

function handleMouseMove(event) {
    cells.forEach(
        (cell) => {
            cell.fill(true, 'white');
            cell.drawBorder();
        }
    );

    let cell = getCellByPosition(event.clientX, event.clientY);
    line(startPos.startX, startPos.startY, cell.left, cell.top);
}

canvas.onmouseup = (e) => handleMouseUp(e);
canvas.onmousedown = (e) => handleMouseDown(e);

//Рисование линии методом Брезенхэма
const line = (x0, y0, x1, y1) => { // из точки (x0,y0) в (x1,y1)
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    while (x0 !== x1 || y0 !== y1) {
        putPixel(x0, y0);

        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
    putPixel(x0, y0);
}

const putPixel = (x, y) => {
    fillCellAtPosition(x, y, true);
}
