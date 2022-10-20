export function createBufferObject(glEnum, size, bufferData, usage) {
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    var verties = new Float32Array([
        -0.5, -0.5, -2.0, 0.6, 0, 0,
        0.5, -0.5, -2.0, 0, 0.7, 0,
        0.0, 0.5, -2.0, 0, 0, 0.5,
    ]);
    const FSIZE = verties.BYTES_PER_ELEMENT
    gl.bufferData(gl.ARRAY_BUFFER, verties, gl.STATIC_DRAW);
    return vbo
}
