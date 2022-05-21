import {settings, endGame, turnSounds, turnSoundtrack,
    turnMode, delayStart} from './settings_module.js';
import {turnSpeed} from './display_module.js';
import {hold, turnQueue} from './hold_queue_module.js';
import {canvas, moveLeft, rotate, moveRight, moveDown, hardDrop,
    moveDownClick} from './tetris_canvas_module.js';

document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('keydown', control)
    settings.startBtn.addEventListener('click', delayStart)
    settings.leftBtn.addEventListener('click', moveLeft)
    settings.rightBtn.addEventListener('click', moveRight)
    settings.rotateBtn.addEventListener('click', () => rotate(1))
    settings.rotateCcBtn.addEventListener('click', () => rotate(-1))
    settings.holdBtn.addEventListener('click', hold)
    settings.holdiBtn.addEventListener('click', hold)
    settings.downBtn.addEventListener('click', moveDownClick)
    settings.hardBtn.addEventListener('click', hardDrop)
    settings.endBtn.addEventListener('click', endGame)
    settings.soundsBtn.addEventListener('click', turnSounds)
    settings.trackBtn.addEventListener('click', turnSoundtrack)
    settings.speedBtn.addEventListener('click', turnSpeed)
    settings.queueBtn.addEventListener('click', turnQueue)
    settings.modeBtn.addEventListener('click', turnMode)

    function control(e) {
        if (settings.timerId) {
            if (settings.keyMoveLeft.has(e.code)) {
                moveLeft()
            } else if(settings.keyClockwise.has(e.code)) {
                rotate(1)
            } else if(settings.keyCounterClockwise.has(e.code)) {
                rotate(-1)
            } else if(settings.keyMoveRight.has(e.code)) {
                moveRight()
            } else if(settings.keyMoveDown.has(e.code)) {
                moveDown()
                if (settings.sounds) new Audio(settings.tracks[0]).play()
            } else if(settings.keyHardDrop.has(e.code)) {
                hardDrop()
            } else if(settings.keyHold.has(e.code)) {
                hold()
            }
        }
        if (settings.keyStart.has(e.code)) {
            delayStart()
        }
        if (settings.keyEnd.has(e.code)) {
            if (canvas.current) endGame()
        }
    }
});