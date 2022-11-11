import _ from 'lodash'
window._ = _
import {init, render} from "./scene";

let lastTime = 0

function timeout() {
    return new Promise((resolve) => {
        window.t = requestAnimationFrame(() => resolve())
    })
}

function getFrameTime() {

    let timeSinceComputerStart = Number(new Date())
    let frameTime = lastTime === 0 ? 0 : timeSinceComputerStart - lastTime;
    lastTime = timeSinceComputerStart;
    return frameTime / 1000.0;
}

async function main() {
    if (window.t) {
        cancelAnimationFrame(window.t)
    }
    await init()

    async function loop() {
        await timeout()
        const delta = getFrameTime()
        await render(delta)
        await loop()
    }

    loop()

}

main()
