import {SceneElement} from "./object";
import {Shader} from "../Shader";
import {Material} from "../Material";
import {createTextTexture, createTextureFromUrl} from "../utils";
import fTexture from "../static/f-texture.png";
import {Sprite} from "../Sprite";
import {SceneNode} from "../SceneNode";

export class Button extends SceneElement {
    constructor(x, y, width, height) {
        console.log('debug x,y, width, height', x, y, width, height)
        super();
        this.x = x
        this.y = y
        this.w = width
        this.h = height
        this.padding = 5
        this.mousedown = false
        this.textNode = null
        this.mModelMatrix = m4.identity()
    }

    async init(sceneRoot) {
        this.uiRootScene = sceneRoot
        this.mModelMatrix = m4.translate(this.mModelMatrix, this.x - gl.canvas.width / 2 + this.w / 2, -this.y + gl.canvas.height / 2 - this.h / 2, 0)
        await this.initSpriteMaterial()
        await this.initSprite()
        await this.initText()
        this.bindEvent()
        this.uiRootScene.add(this.sceneNode)
        this.uiRootScene.add(this.textNode)
    }

    isInRect(e) {
        const {offsetX, offsetY} = e
        let t1 = offsetX >= this.x && offsetX <= (this.x + this.w)
        let t2 = offsetY >= this.y && offsetY <= (this.y + this.h)
        return t1 && t2
    }

    bindEvent() {
        this.mGeometry.addEventListener('mousedown', (e) => {
            this.mousedown = true
            if (this.isInRect(e)) {
                this.mGeometry.setColor(0.5, 0.5, 0.5);
            }
        })

        this.mGeometry.addEventListener('mousemove', (e) => {
            if (this.isInRect(e)) {
                this.mGeometry.setColor(0.8, 0.8, 0.8);
            } else {
                this.mGeometry.setColor(1, 1, 1);
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
        this.sceneNode.mModelMatrix = this.mModelMatrix
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
        textMaterial.depthMask = false;

        let texture = await createTextTexture('hello', this.w + this.padding, this.h + this.padding)
        textMaterial.setTexture("U_texture", texture);

        this.mText = new Sprite()
        this.mText.setSize(this.w, this.h)
        let sceneNode = new SceneNode()
        sceneNode.mModelMatrix = this.mModelMatrix
        sceneNode.init(this.mText, textMaterial)
        this.textNode = sceneNode
    }
}
