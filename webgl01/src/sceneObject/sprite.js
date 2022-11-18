import {Sprite} from "../Sprite";
import {SceneNode} from "../SceneNode";
import {Shader} from "../Shader";
import {Material} from "../Material";
import {createTextureFromUrl} from "../utils";
import fTexture from "../static/f-texture.png";
import {SceneElement} from "./object";


export class Sprite1 extends SceneElement {

    async init(sceneRoot) {
        this.uiRootScene = sceneRoot
        await this.initSpriteMaterial()
        await this.initSprite()
        this.uiRootScene.add(this.sceneNode)
    }

    async initSpriteMaterial() {
        let shader = new Shader()
        await shader.initStandardShader("/src/shaders/sprite.vs.html", "/src/shaders/sprite.fs.html")
        this.mMaterial = new Material()
        this.mMaterial.init(shader);
        this.mMaterial.mbEnableBlend = true;
        this.mMaterial.mbEnableDepthTest = false;
        this.mMaterial.mDSTBlendFunc = gl.ONE_MINUS_SRC_ALPHA;
        let texture = await createTextureFromUrl(fTexture);
        this.mMaterial.setTexture("U_texture", texture);
    }

    async initSprite() {
        this.mGeometry = new Sprite()
        this.mGeometry.setSize(100, 100)
        this.sceneNode = new SceneNode()
        this.sceneNode.mModelMatrix = m4.translation(-350, 250, 0)
        this.sceneNode.init(this.mGeometry, this.mMaterial)
    }
}
