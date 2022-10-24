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
