import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const dinoElement = document.querySelector('[data-dino]');
const jumpSFX = new Audio('assets/sounds/jump.wav')
const _JUMP_SPEED = .45;
const _GRAVITY = .0015;
const _DINO_FRAME_COUNT = 2;
const _FRAME_TIME = 100;
const _RELEASE_MULTIPLIER = .4;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;

export function setupDino() {
    isJumping = false;
    dinoFrame = 0;
    currentFrameTime = 0;
    yVelocity = 0;
    setCustomProperty(dinoElement, "--bottom", 0);
    document.removeEventListener("keydown", onJump);
    document.removeEventListener("keyup", onReleaseJump);
    document.addEventListener("keyup", onReleaseJump);
    document.addEventListener("keydown", onJump);
}

export function updateDino(delta, speedScale) {
    handleRun(delta, speedScale);
    handleJump(delta);
}

export function getDinoRect() {
    return dinoElement.getBoundingClientRect();
}

export function setDinoLose() {
    dinoElement.src = "assets/imgs/dino-lose.png";
}

function handleRun(delta, speedScale) {
    if (isJumping) {
        dinoElement.src = 'assets/imgs/dino-stationary.png'; // Jump frame
        return
    }

    if (currentFrameTime >= _FRAME_TIME) {
        dinoFrame = (dinoFrame + 1) % _DINO_FRAME_COUNT;
        dinoElement.src = `assets/imgs/dino-run-${dinoFrame}.png`;
        currentFrameTime -= _FRAME_TIME;
    }

    currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
    if (!isJumping) {return}

    incrementCustomProperty(dinoElement, "--bottom", yVelocity * delta);

    if (getCustomProperty(dinoElement, "--bottom") <= 0) {
        setCustomProperty(dinoElement, "--bottom", 0);
        isJumping = false;
    }

    yVelocity -= _GRAVITY * delta;
}

function onJump(e) {
    if (e.code == "ArrowUp" && !isJumping 
    || e.code == "Space" && !isJumping) {
        yVelocity = _JUMP_SPEED;
        jumpSFX.play();
        isJumping = true;
    }    
}

function onReleaseJump(e) {
    if (yVelocity <= 0) {return}
    if (e.code == "Space" || e.code == "ArrowUp") {
        yVelocity *= _RELEASE_MULTIPLIER;
    }
}