import {degToRad} from "./math/math_utils";

const canvas = document.querySelector("#c");
const gl = canvas.getContext("webgl");
const width = canvas.clientWidth
const height = canvas.clientHeight
let program
let vbo
var radius = 200;
var cameraAngleRadians = degToRad(0);
var fieldOfViewRadians = degToRad(45);
let FSIZE
var projection_matrix = m4.identity()
var view_matrix = m4.identity()
var model_matrix = m4.identity()


export function init() {
    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // 计算投影矩阵
    projection_matrix = m4.perspective(fieldOfViewRadians, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 2000);
    // 计算相机的朝向矩阵
    view_matrix = m4.lookAt([0, 0, 0], [0, 0, -1], [0, 1, 0]);

    vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    var verties = new Float32Array([
        -0.5, -0.5, -2.0, 1.0, 0.6, 0, 0, 1.0,
        0.5, -0.5, -2.0, 1.0, 0, 0.7, 0, 1.0,
        0.0, 0.5, -2.0, 1.0, 0, 0, 0.5, 1.0,
    ]);
    FSIZE = verties.BYTES_PER_ELEMENT
    gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);


    program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
}

export function render() {
    gl.clearColor(0.1, 0.1, 0.1, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program)
    const M_location = gl.getUniformLocation(program, "M");
    const V_location = gl.getUniformLocation(program, "V");
    const P_location = gl.getUniformLocation(program, "P");

    gl.uniformMatrix4fv(M_location, false, model_matrix)
    gl.uniformMatrix4fv(V_location, false, view_matrix)
    gl.uniformMatrix4fv(P_location, false, projection_matrix)

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const a_position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(a_position)
    gl.vertexAttribPointer(a_position, 4, gl.FLOAT, false, FSIZE * 8, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const a_color = gl.getAttribLocation(program, 'color')
    gl.enableVertexAttribArray(a_color)
    gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, FSIZE * 8, FSIZE * 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    gl.drawArrays(gl.TRIANGLES, 0, 3); /// 画三角形，从第几个点开始 绘制几个点
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.useProgram(null);
}
