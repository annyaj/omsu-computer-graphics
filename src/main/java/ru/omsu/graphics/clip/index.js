const canvas = document.getElementById('clipCanvas');
const context = document.getElementById('clipCanvas').getContext('2d');

let startX = 0;
let startY = 0;
let mouseX = 0;
let mouseY = 0;
let isDrawing = false;
let existingLines = [];
let subjectPolygon = {};
let bothNotInsideIndexes = [];

let isRect = false;
let isLine = false;
let isClip = false;

function clip(x1, x2, y1, y2) { //Алгоритм отсечения Сазерленда-Ходгмана
    for (let i = 0; i < existingLines.length; i++) {
        let firstPointInside = inside(x1, x2, y1, y2, existingLines[i].startX, existingLines[i].startY);
        let secondPointInside = inside(x1, x2, y1, y2, existingLines[i].endX, existingLines[i].endY);

        if (!firstPointInside && secondPointInside) {
            let intersectX = x_intersect(x1, y1, x2, y2, existingLines[i].startX, existingLines[i].startY,
                existingLines[i].endX, existingLines[i].endY);

            let intersectY = y_intersect(x1, y1, x2, y2, existingLines[i].startX, existingLines[i].startY,
                existingLines[i].endX, existingLines[i].endY);

            existingLines[i].startX = intersectX;
            existingLines[i].startY = intersectY;
        } else if (firstPointInside && !secondPointInside) {
            let intersectX = x_intersect(x1, y1, x2, y2, existingLines[i].startX, existingLines[i].startY,
                existingLines[i].endX, existingLines[i].endY);

            let intersectY = y_intersect(x1, y1, x2, y2, existingLines[i].startX, existingLines[i].startY,
                existingLines[i].endX, existingLines[i].endY);

            existingLines[i].endX = intersectX;
            existingLines[i].endY = intersectY;
        } else if (!firstPointInside && !secondPointInside) {
            if (bothNotInsideIndexes.indexOf(i) === -1) {
                bothNotInsideIndexes.push(i);
            }
        }
    }
}


// Реализует алгоритм Сазерленда – Ходжмана
const suthHodgClip = () => {
    isClip = true;

    clip(subjectPolygon.startX + subjectPolygon.width, subjectPolygon.startX + subjectPolygon.width,
        subjectPolygon.startY, subjectPolygon.startY + subjectPolygon.height);

    clip(subjectPolygon.startX + subjectPolygon.width, subjectPolygon.startX,
        subjectPolygon.startY + subjectPolygon.height, subjectPolygon.startY + subjectPolygon.height);

    clip(subjectPolygon.startX, subjectPolygon.startX, subjectPolygon.startY + subjectPolygon.height, subjectPolygon.startY);

    clip(subjectPolygon.startX, subjectPolygon.startX + subjectPolygon.width, subjectPolygon.startY, subjectPolygon.startY);

    bothNotInsideIndexes.sort((num1, num2) => num1 - num2).forEach(
        (num, index) => existingLines.splice(num - index, 1)
    );
    draw();
}

const inside = (x1, x2, y1, y2, pointX, pointY) => {
    return (y2 - y1) * (x1 - pointX) > (x1 - x2) * (pointY - y1);
};

const x_intersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    let num = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
    let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    return Math.round(num / den);
}

const y_intersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    let num = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
    let den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    return Math.round(num / den);
}

const drawLine = (x, y, toX, toY) => {
    context.moveTo(x, y);
    context.lineTo(toX, toY);
}

const draw = () => {
    context.fillStyle = "white";
    context.fillRect(0, 0, 800, 600);

    context.fillStyle = '#515165';
    context.fillRect(subjectPolygon.startX, subjectPolygon.startY,
        subjectPolygon.width, subjectPolygon.height);

    context.strokeStyle = "green";
    context.lineWidth = 3;
    context.beginPath();

    for (let i = 0; i < existingLines.length; ++i) {
        let line = existingLines[i];
        drawLine(line.startX, line.startY, line.endX, line.endY);
    }

    context.stroke();

    if (isDrawing) {
        context.strokeStyle = 'darkred';
        context.fillStyle = '#515165';
        if (isLine) {
            context.beginPath();
            drawLine(startX, startY, mouseX, mouseY);
            context.stroke();
        } else if (isRect) {
            context.fillRect(startX, startY,
                Math.abs(mouseX - startX), Math.abs(mouseY - startY));
        }
    }
}

canvas.onmousedown = (e) => {
    if (e.button === 0) {
        if (!isDrawing) {
            startX = e.clientX;
            startY = e.clientY;

            isDrawing = true;
        }

        draw();
    }
}

canvas.onmouseup = (e) => {
    if (e.button === 0) {
        if (isDrawing) {
            if (isLine) {
                existingLines.push({
                    startX: startX,
                    startY: startY,
                    endX: mouseX,
                    endY: mouseY
                });
            } else if (isRect) {
                subjectPolygon = {
                    startX, startY,
                    width: Math.abs(mouseX - startX),
                    height: Math.abs(mouseY - startY)
                };
            }
        }

        draw();
        if (isLine) {
            startX = mouseX;
            startY = mouseY;
        } else if (isRect) {
            isDrawing = false;
        }
    }
}

canvas.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (isDrawing) {
        draw();
    }
}

const pressRectBtn = () => {
    isRect = !isRect;
    isDrawing = false;
}

const pressLineBtn = () => {
    isLine = !isLine;
    isDrawing = false;
    draw();
}