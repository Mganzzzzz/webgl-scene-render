function isMouseClickEvent() {
    return ['mousedown', 'mouseup'].includes(type)
}

function isMouseMoveEvent(type) {
    return ['mousedown', 'mouseup'].includes(type)
}


export class Geometry {
    constructor() {
        this.eventBus = {}
    }

    active() {

    }

    update() {

    }

    render() {

    }

    unActive() {

    }


    onEvent(e) {
        const {type} = e
        const queue = this.eventBus[type]
        if (Array.isArray(queue)) {
            queue.forEach(n => {
               n(e)
            })
        }
    }

    addEventListener(type, cb) {
        if (!this.eventBus[type]) {
            this.eventBus[type] = []
        }
        this.eventBus[type].push(cb)
    }
}


