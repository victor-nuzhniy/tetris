import {settings, gameOver} from './settings_module.js';
import {display, addScore, scoreSpeedIncrease} from './display_module.js';
import {holdQueue, displayShape} from './hold_queue_module.js';

let canvas = {
    width: 10,
    lTetrimino: function() {
        return [
        [this.width, this.width + 1, this.width + 2, 2],
        [0, this.width, this.width * 2, this.width * 2 + 1],
        [0, 1, 2, this.width],
        [0, 1, this.width + 1, this.width * 2 + 1]
        ];
    },
    jTetrimino: function() {
        return [
        [0, this.width, this.width + 1, this.width + 2],
        [0, 1, this.width, this.width * 2],
        [0, 1, 2, this.width + 2],
        [this.width * 2, 1, this.width + 1, this.width * 2 + 1]
        ];
    },
    zTetrimino: function() {
        return [
        [0, 1, this.width + 1, this.width + 2],
        [1, this.width, this.width + 1, this.width * 2],
        [0, 1, this.width + 1, this.width + 2],
        [1, this.width, this.width + 1, this.width * 2]
        ];
    },
    sTetrimino: function() {
        return [
        [1, 2, this.width, this.width + 1],
        [0, this.width, this.width + 1, this.width * 2 + 1],
        [1, 2, this.width, this.width + 1],
        [0, this.width, this.width + 1, this.width * 2 + 1]
        ];
    },
    tTetrimino: function() {
       return [
       [1, this.width, this.width + 1, this.width + 2],
       [0, this.width, this.width + 1, this.width * 2],
       [0, 1, 2, this.width + 1],
       [1, this.width, this.width + 1, this.width * 2 + 1]
        ];
    },
    oTetrimino: function() {
        return [
        [0, 1, this.width, this.width + 1],
        [0, 1, this.width, this.width + 1],
        [0, 1, this.width, this.width + 1],
        [0, 1, this.width, this.width + 1]
        ];
    },
    iTetrimino: function() {
        return [
        [this.width, this.width + 1, this.width + 2, this.width + 3],
        [1, this.width + 1, this.width * 2 + 1, this.width * 3 + 1],
        [this.width, this.width + 1, this.width + 2, this.width + 3],
        [1, this.width + 1, this.width * 2 + 1, this.width * 3 + 1]
        ];
    },
    Tetriminoes: function() {
        return [this.lTetrimino(), this.jTetrimino(), this.zTetrimino(), this.sTetrimino(),
                    this.tTetrimino(), this.oTetrimino(), this.iTetrimino()];
        },
    theTetriminoes: null,
    colors: [
        'orange',
        'blue',
        'red',
        'green',
        'purple',
        'yellow',
        'cyan'
    ],
    grid: document.querySelector('.grid'),
    squares: Array.from(document.querySelectorAll('.grid div')),
    currentGhostPosition: 0,
    currentPosition: 3,
    currentRotation: 0,
    current: null,
    random: 0

};

function draw() {
    while(canvas.current.some(index =>
    canvas.squares[canvas.currentPosition + index].classList.contains('taken'))) {
        canvas.currentPosition -= canvas.width;
    };
    canvas.currentGhostPosition = canvas.currentPosition;
    while(!canvas.current.some(index => canvas.squares[canvas.currentGhostPosition +
     index + canvas.width].classList.contains('taken'))) {
        canvas.currentGhostPosition += canvas.width;
    };
    canvas.current.forEach(index => {
        canvas.squares[canvas.currentPosition + index].classList.add('tetrimino');
        canvas.squares[canvas.currentPosition + index].style.backgroundColor = canvas.colors[canvas.random];
        canvas.squares[canvas.currentGhostPosition + index].classList.add('ghost');
    });
}

function undraw() {
    canvas.current.forEach(index => {
        canvas.squares[canvas.currentPosition + index].classList.remove('tetrimino');
        canvas.squares[canvas.currentPosition + index].style.backgroundColor = '';
        canvas.squares[canvas.currentGhostPosition + index].classList.remove('ghost');
    });
}

function moveDownClick() {
    if(settings.sounds && settings.timerId) new Audio(settings.tracks[0]).play();
    display.score += 1;
    moveDown();
}

function moveDown() {
    if(settings.timerId) {
        undraw();
        canvas.currentPosition += canvas.width;
        draw();
        display.scoreDisplay.innerHTML = display.score;
        if (display.score > display.highScore) {
            display.highScore = display.score;
            display.highScoreDisplay.innerHTML = display.highScore;
        };
        setTimeout(freeze, display.speedRange[display.speed]*0.9);
    };
}

function moveLeft() {
    if(settings.timerId) {
        undraw();
        const isAtLeftEdge = canvas.current.some(index => (canvas.currentPosition + index) % canvas.width === 0);
        if(!isAtLeftEdge) {
            canvas.currentPosition -=1;
        } else {
            if (settings.sounds) new Audio(settings.tracks[2]).play();
        }
        if(canvas.current.some(index =>
        canvas.squares[canvas.currentPosition + index].classList.contains('taken'))) {
            canvas.currentPosition +=1;
        };
        if (settings.sounds) new Audio(settings.tracks[0]).play();
        draw();
    };
}

function moveRight() {
    if(settings.timerId) {
        undraw();
        const isAtRightEdge = canvas.current.some(index =>
         (canvas.currentPosition + index) % canvas.width === canvas.width - 1);
        if(!isAtRightEdge) {
            canvas.currentPosition +=1;
        } else {
            if (settings.sounds) new Audio(settings.tracks[2]).play();
        }
        if(canvas.current.some(index => canvas.squares[canvas.currentPosition + index].classList.contains('taken'))) {
            canvas.currentPosition -=1;
        }
        if (settings.sounds) new Audio(settings.tracks[0]).play();
        draw();
    };
}

function rotate(index) {
    if(settings.timerId) {
        undraw();
        canvas.currentRotation = (canvas.currentRotation + index) % 4;
        if(canvas.currentRotation == -1) canvas.currentRotation = 3;
        canvas.current = canvas.theTetriminoes[canvas.random][canvas.currentRotation];
        if ((canvas.currentPosition % 10 > 5) && (canvas.currentPosition % 10 < 9)) {
            while(canvas.current.some(index => (index + canvas.currentPosition) % 10 == 0)) {
               canvas.currentPosition -= 1;
           };
       };
       if (canvas.currentPosition % 10 == 9) {
            while(canvas.current.some(index => (index + canvas.currentPosition) % 10 == 9)) {
               canvas.currentPosition +=1;
           };
       };
       if(canvas.current.some(index => canvas.squares[canvas.currentPosition + index].classList.contains('taken'))) {
            while(canvas.current.some(index => canvas.squares[canvas.currentPosition + index].classList.contains('taken'))) {
                canvas.currentPosition -= canvas.width;
            };
       };
       if (settings.sounds) new Audio(settings.tracks[1]).play();
        draw();
    };
}

function hardDrop() {
    if(settings.timerId) {
        undraw();
        let a = Math.floor(canvas.currentPosition / canvas.width);
        while(!(canvas.current.some(index =>
        canvas.squares[canvas.currentPosition + index ].classList.contains('taken')))) {
            canvas.currentPosition += canvas.width;
        };
        display.score += ((Math.floor(canvas.currentPosition / canvas.width) - a) * 2);
        if (settings.sounds) new Audio(settings.tracks[3]).play();
        draw();
    };
}

function freeze() {
    if(canvas.current.some(index => canvas.squares[canvas.currentPosition
        + index + canvas.width].classList.contains('taken'))) {
        canvas.current.forEach(index => canvas.squares[canvas.currentPosition + index].classList.add('taken'));
        if (settings.sounds) new Audio(settings.tracks[4]).play();
        canvas.random = holdQueue.nextRandom.shift();
        holdQueue.nextRandom.push(Math.floor(Math.random()*canvas.theTetriminoes.length));
        canvas.currentRotation = 0;
        canvas.current = canvas.theTetriminoes[canvas.random][canvas.currentRotation];
        canvas.currentPosition = 3;
        if(canvas.random == 5) canvas.currentPosition = 4;
        if(!holdQueue.holdFlag) holdQueue.holdFlag = 1;
        addScore();
        scoreSpeedIncrease();
        gameOver();
        if(!settings.endFlag) draw();
        displayShape(holdQueue.displaySquares, holdQueue.nextRandom, holdQueue.queue);
    };
}

export {canvas, draw, undraw, moveLeft, rotate, moveRight, moveDown, hardDrop, moveDownClick};