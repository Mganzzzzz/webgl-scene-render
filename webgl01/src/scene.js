import {degToRad} from "./math/math_utils";
import {createBufferObject, createProcedureTexture, createTextureFromUrl} from "./utils";
import testImg from './static/test.png'
import {Shader} from "./Shader";
import {VertexBuffer} from "./VertexBuffer";
import {Ground} from "./Ground";
import {Model} from "./Model";
import {SceneNode} from "./SceneNode";
import {Material} from "./Material";
import testTexture from './static/test.png'
import fTexture from './static/f-texture.png'
import niutouTexture from './static/niutou.png'
import {Camera} from "./Camera";
import {Particle} from "./Particle";
import {Sprite} from "./Sprite";
import {Sprite1} from "./sceneObject/sprite";
import {Button} from "./sceneObject/button";
import {MouseClickType, MouseEventType} from "./constant";

const width = gl.canvas.clientWidth
const height = gl.canvas.clientHeight
let texture
let ground

let model
let material
let camera = new Camera()
let cameraPos = [0, 0, 0]
let lightPosition = [0.0, 3.0, 0.0, 1.0]
let pointLightMaterial, niutouColorMaterial, earthColorMaterial
let particle
let particleMaterial
let spriteMaterial
let rootScene = null
let uiRootScene = new SceneNode()
var fieldOfViewRadians = degToRad(45);
var projection_matrix = m4.identity()
var view_matrix = m4.identity()
var ui_projection_matrix = m4.identity() // 正交模式 投影矩阵
var ui_view_matrix = m4.identity() // 正交模式 视口矩阵
var model_matrix = m4.identity()
let sphereNode = null

function addScene(sceneNode) {
    if (!rootScene) {
        rootScene = sceneNode
    } else {
        rootScene.add(sceneNode)
    }
}

function addUiScene(sceneNode) {
    if (!uiRootScene) {
        uiRootScene = sceneNode
    } else {
        uiRootScene.add(sceneNode)
    }
}

async function initGround() {
    ground = new Ground()
    await ground.init()
    const sceneNode = new SceneNode()
    sceneNode.init(ground, pointLightMaterial)
    sceneNode.mModelMatrix = m4.translation(0, -1.5, 0)
    addScene(sceneNode)
}


async function initPointLightMaterial() {
    let shader = new Shader()
    await shader.initStandardShader("/src/shaders/point_light.vs.html", "/src/shaders/point_light.fs.html")
    pointLightMaterial = new Material()
    pointLightMaterial.init(shader)
    pointLightMaterial.setVec4('U_AmbientLightColor', [0.1, 0.1, 0.1, 1.0])
    pointLightMaterial.setVec4('U_AmbientMaterial', [0.1, 0.1, 0.1, 1.0])
    pointLightMaterial.setVec4('U_DiffuseLightColor', [0.1, 0.4, 0.7, 1.0])
    pointLightMaterial.setVec4('U_DiffuseMaterial', [0.9, 0.9, 0.9, 1.0])
    pointLightMaterial.setVec4('U_LightPos', lightPosition)
}

async function initParticleSystem() {
    particle = new Particle()
    particle.init(1000)
    const sceneNode = new SceneNode()
    sceneNode.mModelMatrix = m4.translation(0, 0, 0)
    sceneNode.init(particle, particleMaterial)
    addScene(sceneNode)
}

async function initParticleMaterial() {
    let shader = new Shader()
    await shader.initStandardShader("/src/shaders/particle.vs.html", "/src/shaders/particle.fs.html")
    particleMaterial = new Material()
    particleMaterial.init(shader)
    particleMaterial.mbEnableBlend = true;
    const particleTexture = await createProcedureTexture(128);
    particleMaterial.setTexture('U_texture', particleTexture)
    particleMaterial.mbEnableProgramablePointSize = true;
    particleMaterial.mbEnableDepthTest = false;
}

async function initNiutouMaterial() {
    const texture = await createTextureFromUrl(niutouTexture);
    let shader = new Shader()
    await shader.initStandardShader("/src/shaders/light_color.vs.html", "/src/shaders/light_color.fs.html")
    niutouColorMaterial = new Material()
    niutouColorMaterial.init(shader)
    niutouColorMaterial.setVec4('U_LightPos', [0, 1, 0, 0.0])
    niutouColorMaterial.setVec4('U_CameraPos', [...cameraPos, 1.0])

    niutouColorMaterial.setVec4('U_AmbientLight', [0.7, 0.7, 0.7, 1.0])
    niutouColorMaterial.setVec4('U_AmbientMaterial', [0.8, 0.8, 0.8, 1.0])

    niutouColorMaterial.setVec4('U_DiffuseLight', [1.0, 1.0, 1, 1.0])
    niutouColorMaterial.setVec4('U_DiffuseMaterial', [0.1, 0.4, 0.7, 1.0])

    niutouColorMaterial.setVec4('U_SpecularMaterial', [1.0, 1.0, 1.0, 1.0])
    niutouColorMaterial.setVec4('U_SpecularLight', [1.0, 1.0, 1.0, 1.0])
    niutouColorMaterial.setVec4("U_Setting", [1.0, 4.0, 0.0, 0.0]);

    niutouColorMaterial.setTexture('U_texture', texture)
}

async function initEarthMaterial() {
    let shader = new Shader()
    let texture = await createTextureFromUrl('/src/static/earth.bmp')

    await shader.initStandardShader("/src/shaders/point_light_texture.vs.html", "/src/shaders/point_light_texture.fs.html")
    earthColorMaterial = new Material()
    earthColorMaterial.init(shader)

    earthColorMaterial.init(shader)
    earthColorMaterial.setVec4('U_AmbientLightColor', [0.1, 0.1, 0.1, 1.0])
    earthColorMaterial.setVec4('U_AmbientMaterial', [0.1, 0.1, 0.1, 1.0])
    earthColorMaterial.setVec4('U_DiffuseLightColor', [0.9, 0.9, 0.9, 1.0])
    earthColorMaterial.setVec4('U_DiffuseMaterial', [0.9, 0.9, 0.9, 1.0])
    earthColorMaterial.setVec4('U_LightPos', lightPosition)
    earthColorMaterial.setTexture('U_texture', texture)
}

async function initSpriteMaterial() {
    let shader = new Shader()
    await shader.initStandardShader("/src/shaders/sprite.vs.html", "/src/shaders/sprite.fs.html")
    spriteMaterial = new Material()
    spriteMaterial.init(shader);
    spriteMaterial.mbEnableBlend = true;
    spriteMaterial.mbEnableDepthTest = false;
    spriteMaterial.mDSTBlendFunc = gl.ONE_MINUS_SRC_ALPHA;
    let texture = await createTextureFromUrl(fTexture, false);
    spriteMaterial.setTexture("U_texture", texture);
}

async function initNiutou() {
    model = new Model()
    const sceneNode = new SceneNode()
    await model.init('/src/static/niutou.obj', sceneNode)
    sceneNode.init(model, niutouColorMaterial)
    const modelMatrix = sceneNode.mModelMatrix
    m4.multiply(sceneNode.mModelMatrix, m4.translation(3, -1, -8), sceneNode.mModelMatrix)
    m4.multiply(sceneNode.mModelMatrix, m4.scaling(0.025, 0.025, 0.025), modelMatrix)
    m4.multiply(sceneNode.mModelMatrix, m4.yRotation(degToRad(-90)), sceneNode.mModelMatrix)
    sceneNode.mModelMatrix = modelMatrix
    addScene(sceneNode)
}


async function initSphere() {
    model = new Model()
    const sceneNode = new SceneNode()
    await model.init('/src/static/Sphere.obj', sceneNode)
    sceneNode.mModelMatrix = m4.translation(-3.5, -1, -6)
    m4.multiply(sceneNode.mModelMatrix, m4.yRotation(degToRad(50)), sceneNode.mModelMatrix)
    sceneNode.init(model, pointLightMaterial)
    addScene(sceneNode)
}

async function initEarth() {
    let earthModel = new Model()
    const sceneNode = new SceneNode()
    await earthModel.init('/src/static/Sphere.obj', sceneNode)
    sceneNode.mModelMatrix = m4.translation(-1.5, -1, -6)
    m4.multiply(sceneNode.mModelMatrix, m4.yRotation(degToRad(50)), sceneNode.mModelMatrix)
    sceneNode.init(earthModel, earthColorMaterial)
    sphereNode = sceneNode
    addScene(sceneNode)
    earthModel.addEventListener(MouseEventType.mousedown, (e) => {
        if (e.button === MouseClickType.left) {
            earthModel.leftMouseDown = true
            earthModel.startPoint = e
        }
    })
    earthModel.addEventListener(MouseEventType.mouseup, (e) => {
        if (e.button === MouseClickType.left) {
            earthModel.leftMouseDown = false
        }

    })
    earthModel.addEventListener(MouseEventType.mousemove, (e) => {
        if (earthModel.leftMouseDown) {
            const {clientX, clientY} = e
            const {clientX: startX, clientY: startY} = earthModel.startPoint
            let x = clientX - startX
            let y = clientY - startY
            let xAngle = x / gl.canvas.width * 10
            let yAngle = y / gl.canvas.height * 10
            m4.multiply(sceneNode.mModelMatrix, m4.yRotation(degToRad(xAngle)), sceneNode.mModelMatrix)
            m4.multiply(sceneNode.mModelMatrix, m4.xRotation(degToRad(yAngle)), sceneNode.mModelMatrix)
        }
    })
}

async function initSprite() {
    let sprite = new Sprite()
    sprite.setSize(100, 100)
    const sceneNode = new SceneNode()
    sceneNode.init(sprite, spriteMaterial)
    sceneNode.mModelMatrix = m4.translation(-350, 250, 0)
    addUiScene(sceneNode)
}

function bindEvents() {
    gl.canvas.addEventListener('mousemove', (e) => {
        camera.onMouseMoveEvent(e)
        uiRootScene.onEvent(e)
        rootScene.onEvent(e)


    })
    gl.canvas.addEventListener('mousedown', (e) => {
        camera.onMouseDownEvent(e)
        uiRootScene.onEvent(e)
        rootScene.onEvent(e)
    })
    gl.canvas.addEventListener('mouseup', (e) => {
        camera.onMouseUpEvent(e)
        uiRootScene.onEvent(e)
        rootScene.onEvent(e)
    })
    gl.canvas.addEventListener('mouseover', (e) => {
        uiRootScene.onEvent(e)
        rootScene.onEvent(e)
    })

    gl.canvas.addEventListener('mouseout', (e) => {
        uiRootScene.onEvent(e)
        rootScene.onEvent(e)
    })

    window.addEventListener('keydown', (e) => {
        camera.inKeyEvent(e)
        uiRootScene.onEvent(e)
        rootScene.onEvent(e)
    })
    window.addEventListener('keyup', (e) => {
        camera.inKeyEvent(e)
        uiRootScene.onEvent(e)
        rootScene.onEvent(e)
    })
}

export async function init() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    initUI()
    bindEvents()
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    projection_matrix = m4.perspective(fieldOfViewRadians, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 4000);
    // 设置正射投影
    ui_projection_matrix = m4.orthographic(-gl.canvas.clientWidth / 2, gl.canvas.clientWidth / 2, -gl.canvas.clientHeight / 2, gl.canvas.clientHeight / 2, 200, -400)
    view_matrix = camera.mViewMatrix;
    const button = Button.create(100, 20, 50, 30)
    await button.init(uiRootScene)
    await initParticleMaterial()
    await initEarthMaterial()
    await initPointLightMaterial()
    await initNiutouMaterial()
    await initSpriteMaterial()
    await initSphere()
    await initParticleSystem()
    await initEarth()
    await initNiutou()
    await initSprite()
    await initGround()
}

const $ = document.querySelector.bind(document)

function initUI() {
    const cameraLock = $('.camera-lock')
    cameraLock.checked = true
    camera.disable()
    cameraLock.addEventListener('change', (e) => {
        console.log('debug e', e.target.checked)
        const checked = e.target.checked
        if (checked) {
            camera.disable()
        } else {
            camera.enable()
        }
    })
}

export async function render(deltaTime) {
    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.1, 0.1, 0.1, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    camera.update(deltaTime)
    view_matrix = camera.mViewMatrix;
    rootScene && rootScene.update(view_matrix, projection_matrix, deltaTime)
    rootScene && rootScene.render(view_matrix, projection_matrix)
    uiRootScene && uiRootScene.render(ui_view_matrix, ui_projection_matrix)
}
