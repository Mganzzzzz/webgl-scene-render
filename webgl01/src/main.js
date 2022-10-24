import {init, render} from "./scene";


function timeout() {
    return new Promise((resolve) => {
        window.t = requestAnimationFrame(() => resolve())
    })
}

async function main() {
    if(window.t) {
        cancelAnimationFrame(window.t)
    }
    await init()

    async function loop() {
        await timeout()
        await render()
        await loop()
    }

    loop()

}

main()
