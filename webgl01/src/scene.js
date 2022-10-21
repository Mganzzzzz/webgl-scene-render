import {degToRad} from "./math/math_utils";
import {createBufferObject, createTextureFromUrl} from "./utils";
import testImg from './static/test.png'
import {Shader} from "./Shader";
import {VertexBuffer} from "./VertexBuffer";
import {Ground} from "./Ground";

const width = gl.canvas.clientWidth
const height = gl.canvas.clientHeight
let program
let vbo
let texture
let shader
let ground
var radius = 200;
var cameraAngleRadians = degToRad(0);
var fieldOfViewRadians = degToRad(45);
var projection_matrix = m4.identity()
var view_matrix = m4.identity()
var model_matrix = m4.identity()


export async function init() {
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // 计算投影矩阵
    projection_matrix = m4.perspective(fieldOfViewRadians, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 2000);
    // 计算相机的朝向矩阵
    view_matrix = m4.lookAt([0, 0, 0], [0, 0, -1], [0, 1, 0]);

    texture = await createTextureFromUrl(testImg)
    const vertexBuffer = new VertexBuffer()
    vertexBuffer.setSize(3)
    vertexBuffer.setPosition(0, -0.5, -0.5, -2.0, 1.0)
    vertexBuffer.setPosition(1, 0.5, -0.5, -2.0, 1.0)
    vertexBuffer.setPosition(2, 0.0, 0.5, -2.0, 1.0)

    vertexBuffer.setColor(0, 0.6, 0, 0, 1.0,)
    vertexBuffer.setColor(1, 0, 0.7, 0, 1.0,)
    vertexBuffer.setColor(2, 0, 0, 0.5, 1.0,)

    vertexBuffer.setNormal(0, 0.0, 1.0, 0.0);
    vertexBuffer.setNormal(1, 0.0, 1.0, 0.0);
    vertexBuffer.setNormal(2, 0.0, 1.0, 0.0);

    vertexBuffer.setTexcoord(0, 0.0, 0.0,)
    vertexBuffer.setTexcoord(1, 1.0, 0.0,)
    vertexBuffer.setTexcoord(2, 0.5, 1.0,)
    vbo = createBufferObject(gl.ARRAY_BUFFER, vertexBuffer.getData(), gl.STATIC_DRAW)
    shader = new Shader()
    shader.initStandardShader("test.vs", "test.fs")
    ground = new Ground(shader)
    ground.init()
}

export async function render() {
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.1, 0.1, 0.1, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    ground.render(model_matrix, view_matrix, projection_matrix)
    gl.drawArrays(gl.TRIANGLES, 0, 3); /// 画三角形，从第几个点开始 绘制几个点
    shader.unActive()
}
