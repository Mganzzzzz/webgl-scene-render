import _ from 'lodash'
import {VertexBuffer, VertexData} from "./VertexBuffer";
import {createBufferObject, updateBufferObject} from "./utils";
import {Geometry} from "./Geometry";

export class Particle extends Geometry {
    constructor() {
        super()
        this.mVertexBuffer = new VertexBuffer()
        this.mVbo = 0
        this.mParticleCount = 0
    }

    init(particleCount) {
        this.mParticleCount = particleCount;
        this.mVertexBuffer.setSize(particleCount);
        for (let i = 0; i < particleCount; ++i) {
            /// 具体的渲染位置 由SceneNode 控制
            this.mVertexBuffer.setPosition(i, _.random(-100, 100, true), _.random(-100, 100, true), _.random(-100, 100, true));
            this.mVertexBuffer.setColor(i, _.random(0.1, 0.9, true), _.random(0.1, 0.9, true), _.random(0.1, 0.9, true));
        }
        console.log('debug this.mVertexBuffer', this.mVertexBuffer)
        const bufferData = this.mVertexBuffer.getData()
        this.mVbo = createBufferObject(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
    }

    active() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mVbo)
    }

    render() {
        gl.drawArrays(gl.POINTS, 0, this.mParticleCount)
    }

    update(v, p, deltaTime) {
        for (let i = 0; i < this.mParticleCount; ++i) {
            let x = this.mVertexBuffer.vertexData[i].mPosition[0];
            let y = this.mVertexBuffer.vertexData[i].mPosition[1];
            let z = this.mVertexBuffer.vertexData[i].mPosition[2];
            let changeRange = [-3.0, 3.0]
            this.mVertexBuffer.setPosition(i, x + _.random(...changeRange, true) * deltaTime, y + _.random(...changeRange, true) * deltaTime, z + _.random(...changeRange, true) * deltaTime, 1.0);
        }
        const bufferData = this.mVertexBuffer.getData()
        updateBufferObject(this.mVbo, gl.ARRAY_BUFFER, 0, bufferData);
    }

    unActive() {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

