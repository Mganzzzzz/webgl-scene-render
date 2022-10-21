import {VertexBuffer} from "./VertexBuffer";
import {createBufferObject} from "./utils";
import {Shader} from "./Shader";

export class Ground {
    constructor(shader) {
        this.vbo = null
        this.mShader = shader
        this.mVertexBuffer = new VertexBuffer
    }

    init() {
        this.mVertexBuffer.setSize(1600);
        for (let z = 0; z < 20; ++z) {
            let zStart = 100.0 - z * 10.0
            for (let x = 0; x < 20; ++x) {
                let xStart = x * 10.0 - 100.0

                let offset_quad_index = (x + z * 20) * 4;
                this.mVertexBuffer.setPosition(offset_quad_index, xStart, -1.0, zStart);
                this.mVertexBuffer.setPosition(offset_quad_index + 1, xStart + 10.0, -1.0, zStart);
                this.mVertexBuffer.setPosition(offset_quad_index + 2, xStart, -1.0, zStart - 10.0);
                this.mVertexBuffer.setPosition(offset_quad_index + 3, xStart + 10.0, -1.0, zStart - 10.0);

                this.mVertexBuffer.setNormal(offset_quad_index, 0.0, 1.0, 0.0);
                this.mVertexBuffer.setNormal(offset_quad_index + 1, 0.0, 1.0, 0.0);
                this.mVertexBuffer.setNormal(offset_quad_index + 2, 0.0, 1.0, 0.0);
                this.mVertexBuffer.setNormal(offset_quad_index + 3, 0.0, 1.0, 0.0);

                if ((z % 2) ^ (x % 2)) {
                    this.mVertexBuffer.setColor(offset_quad_index, 0.9, 0.9, 0.9);
                    this.mVertexBuffer.setColor(offset_quad_index + 1, 0.9, 0.9, 0.9);
                    this.mVertexBuffer.setColor(offset_quad_index + 2, 0.9, 0.9, 0.9);
                    this.mVertexBuffer.setColor(offset_quad_index + 3, 0.9, 0.9, 0.9);

                } else {
                    this.mVertexBuffer.setColor(offset_quad_index, 0.1, 0.1, 0.1);
                    this.mVertexBuffer.setColor(offset_quad_index + 1, 0.1, 0.1, 0.1);
                    this.mVertexBuffer.setColor(offset_quad_index + 2, 0.1, 0.1, 0.1);
                    this.mVertexBuffer.setColor(offset_quad_index + 3, 0.1, 0.1, 0.1);
                }
            }
        }
        this.vbo = createBufferObject(gl.ARRAY_BUFFER, this.mVertexBuffer.getData(), gl.STATIC_DRAW)
    }

    render(m, v, p) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
        this.mShader.active()
        this.mShader.setMVP(m, v, p)

        for (let i = 0; i < 400; ++i) {
            // glDrawArrays(GL_TRIANGLE_STRIP, i * 4, 4);
            gl.drawArrays(gl.TRIANGLE_STRIP, i * 4, 4)
        }

    }
}
