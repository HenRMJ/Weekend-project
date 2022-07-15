import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const _SPEED = .05;
const _CACTUS_INTERVAL_MIN = 500;
const _CACTUS_INTERVAL_MAX = 2000;
const worldElement = document.querySelector('[data-world]')

let nextCactusTime;

export function setupCactus() {
    nextCactusTime = _CACTUS_INTERVAL_MIN;
    document.querySelectorAll('[data-cactus]').forEach(cactus => {
        cactus.remove();
    });
}

export function updateCactus(delta, speedScale) {
    document.querySelectorAll('[data-cactus]').forEach(cactus => {
        incrementCustomProperty(cactus, "--left", delta * speedScale * _SPEED * -1);

        if (getCustomProperty(cactus, "--left") <= -100) {
            cactus.remove();
        }
    });

    if (nextCactusTime <= 0) {
        createCactus();
        nextCactusTime = randomNumberBetween(_CACTUS_INTERVAL_MIN, _CACTUS_INTERVAL_MAX) / speedScale;
    }

    nextCactusTime -= delta;
}

export function getCactusRects() {
    return [...document.querySelectorAll('[data-cactus]')].map(cactus => {
        return cactus.getBoundingClientRect();
    })
}

function createCactus() {
    const cactus = document.createElement("img");
    cactus.dataset.cactus = true;
    cactus.src = 'assets/imgs/cactus.png';
    cactus.classList.add("cactus");
    setCustomProperty(cactus, "--left", 100)
    worldElement.append(cactus);
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

