import {degToRad} from "./math/utils";

const canvas = document.querySelector("#c");
const gl = canvas.getContext("webgl");
const width = canvas.clientWidth
const height = canvas.clientHeight
let program
let vbo
var numFs = 5;
var radius = 200;
var fPosition = [radius, 0, 0];
var cameraAngleRadians = degToRad(0);
var up = [0, 1, 0];
var fieldOfViewRadians = degToRad(60);

var projection_matrix, view_matrix, model_matrix
var cameraMatrix = m4.yRotation(cameraAngleRadians);
cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 1.5);

// Get the camera's postion from the matrix we computed
var cameraPosition = [
    cameraMatrix[12],
    cameraMatrix[13],
    cameraMatrix[14],
];


export function init() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    projection_matrix = m4.perspective(45.0, width / height, 0.1, 2000.0);
    var cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);
    // Make a view matrix from the camera matrix
    view_matrix = m4.inverse(cameraMatrix);
    model_matrix = m4.identity();
    vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    var positions = [
        -0.5, -0.5, -1.0,
        0.5, -0.5, -1.0,
        0.0, 0.5, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
}

export function render() {
    gl.clearColor(0.1, 0.4, 0.6, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.CULL_FACE);
    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.useProgram(program)
    const M_location = gl.getUniformLocation(program, "M");
    const V_location = gl.getUniformLocation(program, "V");
    const P_location = gl.getUniformLocation(program, "P");

    gl.uniformMatrix4fv(M_location, false, model_matrix)
    gl.uniformMatrix4fv(V_location, false, view_matrix)
    gl.uniformMatrix4fv(P_location, false, projection_matrix)

    const p = gl.getAttribLocation(program, 'position')

    gl.enableVertexAttribArray(p)
    gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3); /// 画三角形，从第几个点开始 绘制几个点
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // glUseProgram(0);
}
