import {degToRad} from "./math/math_utils";
import {createBufferObject, createTextureFromUrl} from "./utils";
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

const width = gl.canvas.clientWidth
const height = gl.canvas.clientHeight
let texture
let ground
let model
let material
let camera = new Camera()
let cameraPos = [0, 0, 0]
let lightPosition = [0.0, 1.0, 1.0, 1.0]
let pointLightMaterial
let lightColorMaterial
let niutouColorMaterial
let rootScene = null
var fieldOfViewRadians = degToRad(45);
var projection_matrix = m4.identity()
var view_matrix = m4.identity()
var model_matrix = m4.identity()
let sphereNode = null

function addScene(sceneNode) {
    if (!rootScene) {
        rootScene = sceneNode
    } else {
        rootScene.add(sceneNode)
    }
}


async function initLightColorMaterial() {
    const texture = await createTextureFromUrl(testTexture);
    let shader = new Shader()
    shader.initStandardShader("light_color.vs", "light_color.fs")
    lightColorMaterial = new Material()
    lightColorMaterial.init(shader)
    lightColorMaterial.setVec4('U_AmbientLight', [0.1, 0.1, 0.1, 1.0])
    lightColorMaterial.setVec4('U_AmbientMaterial', [0.1, 0.1, 0.1, 1.0])
    lightColorMaterial.setVec4('U_DiffuseLight', [0.8, 0.8, 0.8, 1.0])
    lightColorMaterial.setVec4('U_DiffuseMaterial', [0.4, 0.4, 0.4, 1.0])
    lightColorMaterial.setVec4('U_LightPos', [0.0, 1.0, 0.0, 0.0])
    lightColorMaterial.setTexture('U_texture', texture)
}

async function initGround() {
    ground = new Ground()
    await ground.init()
    const sceneNode = new SceneNode()
    sceneNode.init(ground, lightColorMaterial)
    sceneNode.mModelMatrix = m4.translation(0, -1.5, 0)
    addScene(sceneNode)
}

async function initLightMaterial() {
    let shader = new Shader()
    shader.initStandardShader("light.vs", "light.fs")
    material = new Material()
    material.init(shader)
    material.setVec4('U_AmbientLightColor', [0.1, 0.1, 0.1, 1.0])
    material.setVec4('U_AmbientMaterial', [0.1, 0.1, 0.1, 1.0])
    material.setVec4('U_DiffuseLightColor', [0.1, 0.4, 0.7, 1.0])
    material.setVec4('U_DiffuseMaterial', [0.9, 0.9, 0.9, 1.0])
    material.setVec4('U_LightPos', lightPosition)
}

async function initPointLightMaterial() {
    let shader = new Shader()
    shader.initStandardShader("point_light.vs", "point_light.fs")
    pointLightMaterial = new Material()
    pointLightMaterial.init(shader)
    pointLightMaterial.setVec4('U_AmbientLightColor', [0.1, 0.1, 0.1, 1.0])
    pointLightMaterial.setVec4('U_AmbientMaterial', [0.1, 0.1, 0.1, 1.0])
    pointLightMaterial.setVec4('U_DiffuseLightColor', [0.1, 0.4, 0.7, 1.0])
    pointLightMaterial.setVec4('U_DiffuseMaterial', [0.9, 0.9, 0.9, 1.0])
    pointLightMaterial.setVec4('U_LightPos', lightPosition)
}


async function initNiutouMaterial() {
    const texture = await createTextureFromUrl(niutouTexture);
    let shader = new Shader()
    shader.initStandardShader("light_color.vs", "light_color.fs")
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
    await model.init('/src/static/Cube.obj', sceneNode)
    sceneNode.mModelMatrix = m4.translation(0, 0, -10)
    m4.multiply(sceneNode.mModelMatrix, m4.yRotation(degToRad(50)), sceneNode.mModelMatrix)
    sceneNode.init(model, material)
    addScene(sceneNode)
}

async function initSphere2() {
    model = new Model()
    const sceneNode = new SceneNode()
    await model.init('/src/static/Cube.obj', sceneNode)
    sceneNode.mModelMatrix = m4.translation(-1.5, -1, -6)
    m4.multiply(sceneNode.mModelMatrix, m4.yRotation(degToRad(50)), sceneNode.mModelMatrix)
    sceneNode.init(model, pointLightMaterial)
    sphereNode = sceneNode
    addScene(sceneNode)
}

function bindEvents() {
    let mouseDown = false
    let startPoint = null
    gl.canvas.addEventListener('mousemove', (e) => {
        // console.log('debug e', e)
        camera.onMouseMoveEvent(e)
    })
    gl.canvas.addEventListener('mousedown', (e) => {
        camera.onMouseDownEvent(e)
    })
    gl.canvas.addEventListener('mouseup', (e) => {
        camera.onMouseUpEvent(e)
    })
    window.addEventListener('keydown', (e) => {
        camera.inKeyEvent(e)
    })
    window.addEventListener('keyup', (e) => {
        camera.inKeyEvent(e)
    })
}

export async function init() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    bindEvents()
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    projection_matrix = m4.perspective(fieldOfViewRadians, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 2000);
    view_matrix = camera.mViewMatrix;
    await initLightMaterial()
    await initPointLightMaterial()
    await initLightColorMaterial()
    // await initNiutouMaterial()
    // await initLightMaterial()
    await initSphere()
    // await initSphere2()
    // await initNiutou()
    await initGround()
}

export async function render() {
    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.1, 0.1, 0.1, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    camera.update(0.016)
    view_matrix = camera.mViewMatrix;
    // rootScene.update(view_matrix, projection_matrix)
    rootScene.render(view_matrix, projection_matrix)
}
