import {canvas, draw, moveDown} from './tetris_canvas_module.js';
import {display} from './display_module.js';
import {holdQueue, displayShape} from './hold_queue_module.js';

let settings = {
    startBtn: document.querySelector('#start-button'),
    leftBtn: document.querySelector('#left'),
    rightBtn: document.querySelector('#right'),
    rotateBtn: document.querySelector('#rotate'),
    rotateCcBtn: document.querySelector('#rotateCc'),
    holdBtn: document.querySelector('#hold'),
    holdiBtn: document.querySelector('#holdi'),
    downBtn: document.querySelector('#down'),
    hardBtn: document.querySelector('#hard'),
    endBtn: document.querySelector('#end'),
    soundsBtn: document.querySelector('#sounds'),
    trackBtn: document.querySelector('#soundtrack'),
    speedBtn: document.querySelector('#speed'),
    queueBtn: document.querySelector('#queue'),
    notice: document.querySelector('.notice'),
    modeBtn: document.querySelector('#mode'),

    keyMoveLeft: new Set(['ArrowLeft', 'Numpad4', 'DPad-Left', 'KEYCODE_DPAD_LEFT',
    'KEYCODE_4', 'KEYCODE_NUMPAD_4', 'KEY_4', 'KEY_LEFT']),

    keyClockwise: new Set(['ArrowUp', 'KeyX', 'Numpad1', 'Numpad5', 'Numpad9', 'B',
    'KEYCODE_DPAD_CENTER', 'KEYCODE_3', 'KEYCODE_5', 'KEYCODE_7', 'KEYCODE_POUND',
    'KEYCODE_NUMPAD_3', 'KEYCODE_NUMPAD_5', 'KEYCODE_NUMPAD_7', 'KEY_3', 'KEY_5',
    'KEY_7', 'KEY_OK']),

    keyCounterClockwise: new Set(['ControlLeft', 'ControlRight', 'KeyZ', 'Numpad3',
    'Numpad7', 'A', 'KEYCODE_1', 'KEYCODE_9', 'KEYCODE_STAR', 'KEYCODE_NUMPAD_1',
    'KEYCODE_NUMPAD_9', 'KEY_1', 'KEY_9']),

    keyMoveRight: new Set(['ArrowRight', 'Numpad6', 'DPad-Right', 'KEYCODE_DPAD_RIGHT',
     'KEYCODE_6', 'KEYCODE_NUMPAD_6', 'KEY_6', 'KEY_RIGHT']),

    keyMoveDown: new Set(['ArrowDown', 'Numpad2', 'DPad-Down', 'KEYCODE_DPAD_DOWN',
    'KEYCODE_8', 'KEYCODE_NUMPAD_8', 'KEY_8', 'KEY_DOWN']),

    keyHardDrop: new Set(['Space', 'Numpad8', 'DPad-Up', 'KEYCODE_DPAD_UP',
    'KEYCODE_2', 'KEYCODE_NUMPAD_2', 'KEY_2', 'KEY_UP']),

    keyHold: new Set(['KeyC', 'ShiftLeft', 'ShiftRight', 'X', 'Numpad0', 'KEYCODE_0',
    'KEYCODE_NUMPAD_0', 'KEY_0']),

    keyStart: new Set(['Escape', 'F1', 'Start', 'KEYCODE_MENU', 'KEY_CHANNELUP',
    'KEY_MENU']),

    keyEnd: new Set(['KeyQ']),

    tracks: ['./Sounds/move.mp3', './Sounds/rotate.mp3', './Sounds/wall.mp3',
                    './Sounds/drop.mp3', './Sounds/lock.mp3', './Sounds/full_row.mp3',
                    './Sounds/game_over.mp3', './Sounds/Korobeiniki.mp3'],

    endFlag: 0,
    sounds: 1,
    soundtrack: 0,
    audioTrack: null,
    timerId: null,
    timerSoundTrack: null,
    timerStart: null,
    timerModeState: null
}

function initialize() {
    settings.notice.style.opacity = 0;
    display.speed = 0;
    display.speedDisplay.innerHTML = 1;
    holdQueue.upNextTetriminoes = holdQueue.nextTetriminoes();
    canvas.theTetriminoes = canvas.Tetriminoes();
    if(display.modeState == 3) settings.timerModeState = setTimeout(endGame, 180000);
    display.stateDisplay.innerHTML = 'Game is running';
    canvas.currentPosition = 3;
    canvas.currentRotation = 0;
    canvas.random = Math.floor(Math.random()*canvas.theTetriminoes.length);
    canvas.current = canvas.theTetriminoes[canvas.random][canvas.currentRotation];
    if (canvas.random == 5) canvas.currentPosition = 4;
    holdQueue.nextRandom = [];
    for (let i = 0; i < 6; i += 1) {
        holdQueue.nextRandom.push(Math.floor(Math.random()*canvas.theTetriminoes.length))
    };
    draw();
    settings.timerId = setInterval(moveDown, display.speedRange[display.speed]);
    displayShape(holdQueue.displaySquares, holdQueue.nextRandom, holdQueue.queue);
    settings.endFlag = 0;
    holdQueue.holdRandom = [0];
    holdQueue.holdRandomStack = 0;
    holdQueue.holdFlag = 2;
    display.score = 0;
    display.speedLevel = 0;
    display.lines = 0;
    display.level = 0;
    display.scoreDisplay.innerHTML = 0;
    display.linesDisplay.innerHTML = 0;
    display.levelDisplay.innerHTML = 0;
    settings.audioTrack = new Audio(settings.tracks[7]);
    turnSoundtrack();
}

function startPause() {
    if (settings.sounds) new Audio(settings.tracks[0]).play();
    if (!settings.timerId && !canvas.current) {
        initialize();
    } else if(!settings.timerId && canvas.current && !settings.endFlag) {
        settings.timerId = setInterval(moveDown, display.speedRange[display.speed]);
        display.stateDisplay.innerHTML = 'Game is running';
    } else if(!settings.timerId && canvas.current && settings.endFlag) {
        for (let i = 0; i<220; i+=1) {
            canvas.squares[i].classList.remove('tetrimino');
            canvas.squares[i].classList.remove('taken');
            canvas.squares[i].classList.remove('ghost');
            canvas.squares[i].style.backgroundColor = '';
        };
        holdQueue.displayHolds.forEach(square => {
            square.classList.remove('tetrimino');
            square.style.backgroundColor = '';
            });
        initialize();
    } else if(settings.timerId) {
        clearInterval(settings.timerId);
        settings.timerId = null;
        display.stateDisplay.innerHTML = 'Game is paused';
    };
}

function delayStart() {
    if(!settings.timerId){
        settings.timerStart = setTimeout(startPause, 3000);
        display.stateDisplay.innerHTML = 'Will run in a moment';
    } else {
        startPause();
    };
}

function gameOver() {
    if (canvas.current.some(index => canvas.squares[canvas.currentPosition
        + index + canvas.width].classList.contains('taken'))) {
        display.stateDisplay.innerHTML = 'Game over';
        if (settings.sounds) new Audio(settings.tracks[6]).play();
        clearInterval(settings.timerId);
        settings.timerId = null;
        settings.endFlag = 1;
        canvas.current.forEach(index => {
            canvas.squares[canvas.currentPosition + index].classList.add('tetrimino');
            canvas.squares[canvas.currentPosition + index].style.backgroundColor = canvas.colors[canvas.random];
        });
    };
}

function endGame() {
    if (!settings.endFlag) {
        if (settings.sounds) new Audio(settings.tracks[6]).play();
        display.stateDisplay.innerHTML = 'Game over';
        if (settings.timerId) {
            clearInterval(settings.timerId);
            settings.timerId = null;
        };
        settings.endFlag = 1;
        if(settings.soundtrack) turnSoundtrack();
    };
}

function turnSounds() {
    if (settings.sounds) {
        settings.sounds = 0;
        display.soundsDisplay.innerHTML = 'off';
    } else {
        settings.sounds = 1;
        display.soundsDisplay.innerHTML = 'on';
    };
}

function turnSoundtrack() {
    if (settings.soundtrack) {
        settings.soundtrack = 0;
        clearTimeout(settings.timerSoundTrack);
        settings.audioTrack.pause();
        settings.audioTrack.currentTime = 0;
        display.trackDisplay.innerHTML = 'off';
    } else {
        settings.soundtrack = 1;
        playTrack();
        display.trackDisplay.innerHTML = 'on';
    };
}

function playTrack() {
    settings.audioTrack = new Audio(settings.tracks[7]);
    settings.audioTrack.play();
    settings.timerSoundTrack = setTimeout(playTrack, 32000);
}

function turnMode() {
    if(!canvas.current || settings.endFlag) {
        display.modeState = (display.modeState + 1) % 4;
        display.modeDisplay.innerHTML = display.modeList[display.modeState];
        };
}

export {settings, endGame, turnSounds, turnSoundtrack, turnMode, delayStart, gameOver};