export function createBufferObject(glEnum = gl.ARRAY_BUFFER, bufferData, usage = gl.STATIC_DRAW) {
    const vbo = gl.createBuffer()
    gl.bindBuffer(glEnum, vbo);
    var verties = new Float32Array(bufferData);
    gl.bufferData(glEnum, verties, usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return vbo
}

export function createTexture2DFromImg(image) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    return texture
}

export async function createTextureFromUrl(path) {
    var image = new Image();

    image.src = path;
    return new Promise((resolve, reject) => {
        image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            const texture = createTexture2DFromImg(image)
            resolve(texture)
        });
    })
}

export async function loadFileFromUrl(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text
}
