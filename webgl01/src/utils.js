export function createBufferObject(glEnum = gl.ARRAY_BUFFER, bufferData, usage = gl.STATIC_DRAW) {
    const vbo = gl.createBuffer()
    gl.bindBuffer(glEnum, vbo);
    var verties = new Float32Array(bufferData);
    gl.bufferData(glEnum, verties, usage);
    gl.bindBuffer(glEnum, null)
    return vbo
}

export function updateBufferObject(bufferObject, glEnum, offset, bufferData) {
    var verties = new Float32Array(bufferData);
    gl.bindBuffer(glEnum, bufferObject); // 将GL_ARRAY_BUFFER 这个卡槽与vbo 绑定 字词后面对GL_ARRAY_BUFFER 的操作都是在操作第二个参数vbo
    gl.bufferSubData(glEnum, offset, verties); // 不用开辟空间直接传输数据 发送到GPU上面
    gl.bindBuffer(glEnum, null); // 将GL_ARRAY_BUFFER指向0号空间 防止后续操作修改vbo的数 据
}


// this function will flip the imagedata
function flipImage(inputImage) {
    // create a canvas that will present the output image
    const outputImage = document.createElement('canvas');
    outputImage.width = inputImage.naturalWidth;
    outputImage.height = inputImage.naturalHeight;
    // get the drawing context, needed to draw the new image
    const ctx = outputImage.getContext('2d');
    ctx.scale(1, -1);
    ctx.translate(0, -inputImage.height);
    ctx.drawImage(inputImage, 0, 0, inputImage.width, inputImage.height, 0, 0, outputImage.width, outputImage.height);
    // document.body.append(outputImage)
    // insert the output image after the input image
    return outputImage
}

export function createTexture2DFromImg(image, flip = true) {
    if(flip) {
        image = flipImage(image)
    }
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    //     new Uint8Array([0, 0, 255, 255]));
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


export function createTextureCubeFromImgs(front, back, left, right, top, bottom) {
    let texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, front);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, back);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, left);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, right);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bottom);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, top);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    return texture;
}

export async function createProcedureTexture(size) {
    let halfSize = size / 2;
    let centerX = halfSize;
    let centerY = halfSize;
    const canvasElement = document.createElement('canvas');
    canvasElement.width = size
    canvasElement.height = size
    const ctx = canvasElement.getContext('2d');
    const imageBuffer = new Uint8ClampedArray(size * size * 4)
    let maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    for(let i = 0; i < size; ++i) {
        for(let j = 0; j < size; ++j) {
            let currentPixelOffset = (i + j * size) * 4;
            imageBuffer[currentPixelOffset] = 255;
            imageBuffer[currentPixelOffset + 1] = 255;
            imageBuffer[currentPixelOffset + 2] = 255;
            let deltaX = centerX - i;
            let deltaY = centerY - j;
            let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            let alpha = Math.pow((1.0 - distance / maxDistance), 8.0);
            alpha = alpha > 1.0 ? 1.0 : alpha;
            imageBuffer[currentPixelOffset + 3] = alpha * 255.0
        }
    }
    const imagData = new ImageData(imageBuffer, size, size)
    ctx.putImageData(imagData, 0, 0)
    const url = canvasElement.toDataURL('image/png')
    const img = new Image()
    img.src = url
    return new Promise((resolve, reject) => {
        img.addEventListener('load', () => {
            const texture = createTexture2DFromImg(img, false)
            resolve(texture)
        })

    })
}

export async function createTextureFromUrl(path, flip) {
    document.querySelector('.loading').innerHTML += `<p class="loading-log">载入材质${path}</p>`
    var image = new Image();

    image.src = path;
    return new Promise((resolve, reject) => {
        image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            const texture = createTexture2DFromImg(image, flip)
            resolve(texture)
        });
    })
}

export async function createTextureCubeFromUrl(front, back, left, right, top, bottom) {

    const ps = [front, back, left, right, top, bottom].map(path => {
        var image = new Image();
        image.src = path;
        return new Promise((resolve, reject) => {
            image.addEventListener('load', function() {
                // Now that the image has loaded make copy it to the texture.
                resolve(image)
            });
        })
    })
    return Promise.all(ps).then(r => {
        console.log('debug r', r)
        return createTextureCubeFromImgs(...r)
    })
}

export async function createTextTexture(content, width, height) {
    let textCanvas = makeTextCanvas(content, width, height);
    let textTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textTex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    // make sure we can render it even if it's not a power of 2
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return textTex
}

export async function loadFileFromUrl(path) {
    document.querySelector('.loading').innerHTML += `<p class="loading-log">加载文件 ${path}</p>`
    const response = await fetch(path);
    const text = await response.text();
    return text
}

export async function loadHtmlShader(path) {
    document.querySelector('.loading').innerHTML += `<p class="loading-log">加载shader ${path}</p>`
    const content = await fetch(path).then(r => r.text())
    const shaderBox = document.querySelector('.shaders')
    shaderBox.innerHTML = shaderBox.innerHTML + content
    return path.replace('.html', '').split('/').reverse()[0];
}


export function makeTextCanvas(text, width, height) {
    const canvasElement = document.createElement('canvas');
    var textCtx = canvasElement.getContext("2d")
    textCtx.canvas.width = width;
    textCtx.canvas.height = height;
    textCtx.font = "20px serif";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    textCtx.fillStyle = "black";
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(text, width / 2, height / 2);
    textCtx.strokeText(text, width / 2, height / 2);
    return canvasElement
}
