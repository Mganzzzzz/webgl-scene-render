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

const width = gl.canvas.clientWidth
const height = gl.canvas.clientHeight
let texture
let ground
let model
let material
let lightColorMaterial
let niutouColorMaterial
let rootScene = null
var fieldOfViewRadians = degToRad(45);
var projection_matrix = m4.identity()
var view_matrix = m4.identity()
var model_matrix = m4.identity()

function addScene(sceneNode) {
    if(!rootScene) {
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
    material.setVec4('U_AmbientLight', [0.1, 0.1, 0.1, 1.0])
    material.setVec4('U_AmbientMaterial', [0.1, 0.1, 0.1, 1.0])
    material.setVec4('U_DiffuseLight', [0.8, 0.8, 0.8, 1.0])
    material.setVec4('U_DiffuseMaterial', [0.4, 0.4, 0.4, 1.0])
    material.setVec4('U_LightPos', [1.0, 0.0, 1.0, 0.0])
}

async function initNiutouMaterial() {
    const texture = await createTextureFromUrl(fTexture);
    let shader = new Shader()
    shader.initStandardShader("light_color.vs", "light_color.fs")
    niutouColorMaterial = new Material()
    niutouColorMaterial.init(shader)
    // niutouColorMaterial.setVec4('U_AmbientLight', [0.1, 0.1, 0.1, 1.0])
    // niutouColorMaterial.setVec4('U_AmbientMaterial', [0.1, 0.1, 0.1, 1.0])
    // niutouColorMaterial.setVec4('U_DiffuseLight', [0.8, 0.8, 0.8, 1.0])
    // niutouColorMaterial.setVec4('U_DiffuseMaterial', [0.4, 0.4, 0.4, 1.0])
    niutouColorMaterial.setTexture('U_texture', texture)
}

async function initNiutou() {
    model = new Model()
    const sceneNode = new SceneNode()
    await model.init('/src/static/Quad.obj', sceneNode)
    sceneNode.mModelMatrix = m4.translation(0, 0, -10)
    sceneNode.init(model, niutouColorMaterial)
    // sceneNode.mModelMatrix = m4.yRotate(sceneNode.mModelMatrix, degToRad(-90))
    // sceneNode.mModelMatrix = m4.scale(sceneNode.mModelMatrix, 0.025, 0.025, 0.025)

    addScene(sceneNode)
}

async function initSphere() {
    model = new Model()
    const sceneNode = new SceneNode()
    await model.init('/src/static/Sphere.obj', sceneNode)
    sceneNode.mModelMatrix = m4.translation(0, 0, -10)
    sceneNode.init(model, material)
    addScene(sceneNode)
}

export async function init() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    projection_matrix = m4.perspective(fieldOfViewRadians, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 2000);
    view_matrix = m4.lookAt([0, 0, 0], [0, 0, -1], [0, 1, 0]);
    await initLightColorMaterial()
    await initNiutouMaterial()
    await initLightMaterial()
    // await initSphere()
    await initNiutou()
    // await initGround()
}

export async function render() {
    gl.enable(gl.CULL_FACE)
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.1, 0.4, 0.6, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    rootScene.update(view_matrix, projection_matrix)
    rootScene.render(view_matrix, projection_matrix)
}
