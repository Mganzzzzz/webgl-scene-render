import {LinkedList} from "./LinkedList";

export class SceneNode extends LinkedList {
    constructor() {
        super()
        this.mModelMatrix = m4.identity()
        this.mGeometry = null;
        this.mMaterial = null;
    }

    init(geometry, material) {
        this.mGeometry = geometry;
        this.mMaterial = material;
    }


    update(v, p) {
        this.mGeometry.update(v, p)
        if (this.next) {
            this.next.update(v, p)
        }
    }

    render(v, p) {
        this.mGeometry.active()
        this.mMaterial.setMat4('M', this.mModelMatrix)
        this.mMaterial.active(v, p)
        this.mGeometry.render()
        this.mMaterial.unActive()
        this.mGeometry.unActive()
        if (this.next) {
            this.next.render(v, p)
        }
    }
}
