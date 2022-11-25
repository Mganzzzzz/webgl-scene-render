import {SceneElement} from "./object";
import {Shader} from "../Shader";
import {Material} from "../Material";
import {createTextTexture, createTextureFromUrl} from "../utils";
import fTexture from "../static/f-texture.png";
import {Sprite} from "../Sprite";
            import {SceneNode} from "../SceneNode";

export class Button extends SceneElement {
    constructor() {
        super();
        this.x = 0
        this.y = 0
        this.w = 50
        this.h = 30
        this.mousedown = false
        this.textNode = null
    }

    async init(sceneRoot) {
        this.uiRootScene = sceneRoot
        await this.initSpriteMaterial()
        await this.initSprite()
        await this.initText()
        this.bindEvent()
        this.uiRootScene.add(this.sceneNode)
        this.uiRootScene.add(this.textNode)
    }

    isInRect(e) {
        const {clientX: x, clientY: y} = e
        let _x = x - gl.canvas.width / 2
        let _y = y - gl.canvas.height / 2
        return _x > this.x && _x < this.x + this.w / 2 && _y > this.y && _y < this.y + this.h / 2
    }

    bindEvent() {
        this.mGeometry.addEventListener('mousedown', (e) => {
            this.mousedown = true
            if (this.isInRect(e)) {
                this.mGeometry.setColor(0.7, 0.7, 0.7);
            }
        })

        this.mGeometry.addEventListener('mouseup', (e) => {
            this.mousedown = false
            this.mGeometry.setColor(1.0, 1.0, 1.0);
        })
    }


    async initSpriteMaterial() {
        let shader = new Shader()
        await shader.initStandardShader("/src/shaders/button.vs.html", "/src/shaders/button.fs.html")
        this.mMaterial = new Material()
        this.mMaterial.init(shader);
        this.mMaterial.mbEnableBlend = true;
        this.mMaterial.mbEnableDepthTest = false;
        this.mMaterial.mDSTBlendFunc = gl.ONE_MINUS_SRC_ALPHA;
    }

    async initSprite() {
        this.mGeometry = new Sprite()
        this.mGeometry.setSize(this.w, this.h)
        this.sceneNode = new SceneNode()
        this.sceneNode.mModelMatrix = m4.translate(this.sceneNode.mModelMatrix, this.x, this.y, 0)
        this.sceneNode.init(this.mGeometry, this.mMaterial)
    }

    async initText() {
        let shader = new Shader()
        await shader.initStandardShader("/src/shaders/text.vs.html", "/src/shaders/text.fs.html")
        let textMaterial = new Material()
        textMaterial.mbEnableBlend = true
        textMaterial.mSRCBlendFunc = gl.ONE
        textMaterial.mDSTBlendFunc = gl.ONE_MINUS_SRC_ALPHA
        textMaterial.init(shader);
        let texture = await createTextTexture('test', 100, 50)
        textMaterial.setTexture("U_texture", texture);

        this.mText = new Sprite()
        this.mText.setSize(this.w, this.h)
        let sceneNode = new SceneNode()
        sceneNode.mModelMatrix = m4.translate(sceneNode.mModelMatrix, this.x, this.y, 0)
        sceneNode.init(this.mText, textMaterial)
        this.textNode = sceneNode
    }
}
