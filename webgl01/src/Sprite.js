import {VertexBuffer} from "./VertexBuffer";
import {createBufferObject, updateBufferObject} from "./utils";
import {Geometry} from "./Geometry";

export class Sprite extends Geometry {
    constructor() {
        super()
        this.vbo = null
        this.mVertexBuffer = new VertexBuffer()
        this.mVertexBuffer.setSize(4);
        this.mVertexBuffer.setTexcoord(0, 0.0, 0.0);
        this.mVertexBuffer.setTexcoord(1, 1.0, 0.0);
        this.mVertexBuffer.setTexcoord(2, 0.0, 1.0);
        this.mVertexBuffer.setTexcoord(3, 1.0, 1.0);

        this.mVertexBuffer.setColor(0, 1.0, 1.0, 1.0);
        this.mVertexBuffer.setColor(1, 1.0, 1.0, 1.0);
        this.mVertexBuffer.setColor(2, 1.0, 1.0, 1.0);
        this.mVertexBuffer.setColor(3, 1.0, 1.0, 1.0);
        const bufferData = this.mVertexBuffer.getData()
        this.vbo = createBufferObject(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW)
    }


    setColor(r, g, b) {
        this.mVertexBuffer.setColor(0, r, g, b);
        this.mVertexBuffer.setColor(1, r, g, b);
        this.mVertexBuffer.setColor(2, r, g, b);
        this.mVertexBuffer.setColor(3, r, g, b);

        const bufferData = this.mVertexBuffer.getData()
        updateBufferObject(this.vbo, gl.ARRAY_BUFFER, 0, bufferData);
    }

    setSize(width, height) {
        this.mVertexBuffer.setPosition(0, -width / 2.0, -height / 2.0, -20);
        this.mVertexBuffer.setPosition(1, width / 2.0, -height / 2.0, -20);
        this.mVertexBuffer.setPosition(2, -width / 2.0, height / 2.0, -20);
        this.mVertexBuffer.setPosition(3, width / 2.0, height / 2.0, -20);
        const bufferData = this.mVertexBuffer.getData()
        updateBufferObject(this.vbo, gl.ARRAY_BUFFER, 0, bufferData);
    }

    active() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    }

    render() {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    unActive() {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }


}
