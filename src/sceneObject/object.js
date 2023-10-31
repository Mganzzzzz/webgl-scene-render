import {SceneNode} from "../SceneNode";

export class SceneElement {
    constructor() {
        this.sceneNode = null
        this.mGeometry = null
        this.mMaterial = null
        this.uiRootScene = null
        this.rootScene = null
    }



    static create(...args) {
        return new this(...args)
    }


}
