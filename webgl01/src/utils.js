export function createBufferObject(glEnum = gl.ARRAY_BUFFER, bufferData, usage = gl.STATIC_DRAW) {
    const vbo = gl.createBuffer()
    gl.bindBuffer(glEnum, vbo);
    var verties = new Float32Array(bufferData);
    gl.bufferData(glEnum, verties, usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return vbo
}


export async function createTextureFromUrl(path) {
    var image = new Image();
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));
    image.src = path;
    return new Promise((resolve, reject) => {
        image.addEventListener('load', function () {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            resolve(texture)
        });
    })
}
