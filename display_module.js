import {canvas, moveDown} from './tetris_canvas_module.js';
import {settings, endGame} from './settings_module.js';

let display = {
    scoreDisplay: document.querySelector('#score'),
    linesDisplay: document.querySelector('#lines'),
    levelDisplay: document.querySelector('#level'),
    highScoreDisplay: document.querySelector('#highScore'),
    modeDisplay: document.querySelector('#modeValue'),
    soundsDisplay: document.querySelector('#soundsDisplay'),
    trackDisplay: document.querySelector('#trackDisplay'),
    speedDisplay: document.querySelector('#speedDisplay'),
    queueDisplay: document.querySelector('#queueDisplay'),
    stateDisplay: document.querySelector('#state'),

    modeList: ['Simple', 'Marathon', '40-line', '3-minute'],
    scoreValue: [0, 100, 300, 500, 800],
    speedRange: [1000, 910, 820, 730, 640, 550, 460, 370,  280, 190],
    score: 0,
    highScore: 0,
    lines: 0,
    level: 0,
    speed: 0,
    speedLevel: 0,
    modeState: 0
}

function addScore() {
    let numberLines = 0;
    for (let i = 0; i < 219; i += canvas.width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
        if (row.every(index => canvas.squares[index].classList.contains('taken'))) {
            numberLines += 1;
            row.forEach(index => {
                canvas.squares[index].classList.remove('taken');
                canvas.squares[index].classList.remove('tetrimino');
                canvas.squares[index].style.backgroundColor = '';
                canvas.squares[index].classList.remove('ghost');
            });
            const squaresRemoved = canvas.squares.splice(i, canvas.width);
            canvas.squares = squaresRemoved.concat(canvas.squares);
            canvas.squares.forEach(cell => canvas.grid.appendChild(cell));
        };
    };
    if(numberLines) {
        if (settings.sounds) new Audio(settings.tracks[5]).play();
        display.score += display.scoreValue[numberLines];
        if(display.score > display.highScore) {
            display.highScore = display.score;
            display.highScoreDisplay.innerHTML = display.highScore;
        };
        display.lines += numberLines;
        display.level = Math.floor(display.lines / 10);
        display.scoreDisplay.innerHTML = display.score;
        display.linesDisplay.innerHTML = display.lines;
        display.levelDisplay.innerHTML = display.level;
        if(display.modeState == 1 || display.modeState == 2) {
            if (display.level == 15 || display.lines >= 40) endGame();
        };
    };
}

function scoreSpeedIncrease() {
    if(Math.floor(display.score / 1000) > display.speedLevel) {
        display.speedLevel += 1;
        turnSpeed();
    };
}

function turnSpeed() {
    display.speed = (display.speed + 1) % 10;
    if (settings.timerId){
        clearInterval(settings.timerId);
        settings.timerId = setInterval(moveDown, display.speedRange[display.speed]);
    };
    display.speedDisplay.innerHTML = display.speed + 1;
}

export {display, addScore, turnSpeed, scoreSpeedIncrease};