import {canvas, draw, undraw} from './tetris_canvas_module.js';
import {display} from './display_module.js';
import {settings} from './settings_module.js';

let holdQueue = {
    displaySquares: document.querySelectorAll('.mini-grid div'),
    displayHolds: document.querySelectorAll('.hold-grid div'),
    displayWidth: 5,

    nextTetriminoes: function() {
        return [
        [this.displayWidth+3, this.displayWidth*2+1, this.displayWidth*2+2, this.displayWidth*2+3],
        [this.displayWidth+1, this.displayWidth*2+1, this.displayWidth*2+2, this.displayWidth*2+3],
        [this.displayWidth+1, this.displayWidth+2, this.displayWidth*2+2, this.displayWidth*2+3],
        [this.displayWidth+2, this.displayWidth+3, this.displayWidth*2+1, this.displayWidth*2+2],
        [this.displayWidth+2, this.displayWidth*2+1, this.displayWidth*2+2, this.displayWidth*2+3],
        [this.displayWidth+1, this.displayWidth+2, this.displayWidth*2+1, this.displayWidth*2+2],
        [this.displayWidth*2, this.displayWidth*2+1, this.displayWidth*2+2, this.displayWidth*2+3]
        ];
    },
    upNextTetriminoes: null,
    holdRandom: 0,
    holdRandomStack: 0,
    nextRandom: [0],
    queue: 6,
    holdFlag: 2
}

function createRandom() {
    canvas.random = holdQueue.nextRandom[0];
    for(let i = 0; i < 5; i += 1) {
    holdQueue.nextRandom[i] = holdQueue.nextRandom[i+1];
    };
    holdQueue.nextRandom[5] = Math.floor(Math.random()*canvas.theTetriminoes.length);
}

function hold() {
    if(settings.timerId) {
        if (settings.sounds) new Audio(settings.tracks[0]).play();
        if (holdQueue.holdFlag) {
            undraw();
            holdQueue.holdRandom[0] = canvas.random;
            if (holdQueue.holdFlag == 2) {
                holdQueue.holdRandomStack = holdQueue.holdRandom[0];
                canvas.random = holdQueue.nextRandom.shift();
                holdQueue.nextRandom.push(Math.floor(Math.random()*canvas.theTetriminoes.length));
                displayShape(holdQueue.displaySquares, holdQueue.nextRandom, holdQueue.queue);
            } else {
                canvas.random = holdQueue.holdRandomStack;
                holdQueue.holdRandomStack = holdQueue.holdRandom[0];
            }
            holdQueue.holdFlag = 0;
            canvas.currentRotation = 0;
            canvas.current = canvas.theTetriminoes[canvas.random][canvas.currentRotation];
            canvas.currentPosition = 3;
            if (canvas.random == 5) canvas.currentPosition = 4;
            draw();
            displayShape(holdQueue.displayHolds, holdQueue.holdRandom, 1);
        };
    };
}

function displayShape(screen, marker, number) {
    screen.forEach(index => {
        index.classList.remove('tetrimino');
        index.style.backgroundColor = '';
    });
    for(let i = 0; i < number; i += 1) {
        let limit = 20 + i * 20;
        holdQueue.upNextTetriminoes[marker[i]].forEach(index => {
            screen[index + i*20].classList.add('tetrimino');
            screen[index + i*20].style.backgroundColor = canvas.colors[marker[i]];
        });
    };
}

function turnQueue() {
    holdQueue.queue = (holdQueue.queue + 1) % 7;
    if (canvas.current) displayShape(holdQueue.displaySquares, holdQueue.nextRandom, holdQueue.queue);
    display.queueDisplay.innerHTML = holdQueue.queue;
}

export {holdQueue, hold, turnQueue, displayShape};