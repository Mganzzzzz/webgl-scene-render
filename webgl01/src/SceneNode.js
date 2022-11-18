import {LinkedList} from "./LinkedList";

export class SceneNode extends LinkedList {
    constructor() {
        super()
        this.mModelMatrix = m4.identity()
        this.mGeometry = null;
        this.mMaterial = null;
        this.inited = false
    }

    init(geometry, material) {
        this.mGeometry = geometry;
        this.mMaterial = material;
        this.inited = true
    }


    update(v, p, deltaTime) {
        if (this.inited) {
            this.mGeometry.update(v, p, deltaTime)
        }
        if (this.next) {
            this.next.update(v, p, deltaTime)
        }
    }

    onEvent(e) {
        if (this.mGeometry) {
            this.mGeometry.onEvent(e)
        }
        if (this.next) {
            this.next.onEvent(e)
        }
    }

    render(v, p) {
        if (this.inited) {
            this.mGeometry.active()
            this.mMaterial.setMat4('M', this.mModelMatrix)
            this.mMaterial.active(v, p)
            this.mGeometry.render()
            this.mMaterial.unActive()
            this.mGeometry.unActive()
        }
        if (this.next) {
            this.next.render(v, p)
        }
    }
}
