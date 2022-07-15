import {setupGround, updateGround} from './ground.js';
import {updateDino, setupDino, getDinoRect, setDinoLose} from './dino.js';
import {updateCactus, setupCactus, getCactusRects} from './cactus.js';

const _WORLD_WIDTH = 100;
const _WORLD_HEIGHT = 30;
const _SPEED_SCALE_INCREASE = .00001;

const worldElem = document.querySelector('[data-world]');
const scoreElement = document.querySelector('[data-score]');
const startScreenElement = document.querySelector('[data-start-screen');

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleStart, { once: true});

let lastTime;
let speedScale;
let score;

function update(time) {
    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
    }

    const delta = time - lastTime;

    updateGround(delta, speedScale);
    updateDino(delta, speedScale);
    updateCactus(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);

    if (checkLose()) {
        return handleLose();
    }

    lastTime = time;
    window.requestAnimationFrame(update);
}

function updateSpeedScale(delta) {
    speedScale += delta * _SPEED_SCALE_INCREASE;
}

function checkLose() {
    const dinoRect = getDinoRect();
    return getCactusRects().some(rect => {
        return isCollision(rect, dinoRect);
    })

}

function isCollision(rect1, rect2) {
    return (rect1.left < rect2.right && 
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top)
}

function updateScore(delta) {
    score += delta * .01;
    scoreElement.textContent = Math.floor(score);
}

function handleStart() {
    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupDino();
    setupCactus();
    startScreenElement.classList.add("hide");
    window.requestAnimationFrame(update);
}

function handleLose() {
    setDinoLose();
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, {once: true});
        startScreenElement.classList.remove("hide");
    }, 100)
}

function setPixelToWorldScale() {
    let worldToPixelScale;
    if (window.innerWidth / window.innerHeight < _WORLD_WIDTH / _WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / _WORLD_WIDTH;
    } else {
        worldToPixelScale = window.innerHeight / _WORLD_HEIGHT;
    }

    worldElem.style.width = `${_WORLD_WIDTH * worldToPixelScale}px`;
    worldElem.style.height = `${_WORLD_HEIGHT * worldToPixelScale}px`;
}