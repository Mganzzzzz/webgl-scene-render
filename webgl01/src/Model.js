import {createBufferObject, loadFileFromUrl} from "./utils";
import {VertexBuffer} from "./VertexBuffer";

// import Quad from './static/Quad.obj'

export class Model {
    constructor(shader) {
        this.shader = shader
        this.vbo = null
        this.mVertexBuffer = new VertexBuffer
        this.mAmbientMaterial = [0, 0, 0, 0]
        this.mDiffuseMaterial = [0, 0, 0, 0]
        this.mSpecularMaterial = [0, 0, 0, 0]
    }

    async init() {
        const positions = []
        const texcoords = []
        const normals = []
        const vertexData = []
        const file = await loadFileFromUrl('/src/static/Sphere.obj')
        const lines = file.split('\n')
        lines.forEach(line => {
            if(line.startsWith('v')) {
                if(line.startsWith('v ')) {
                    let tmp = line.replace('v ', '').split(' ')
                    tmp = tmp.map(t => parseFloat(t))
                    positions.push(tmp)
                } else if(line.startsWith('vt ')) {
                    let tmp = line.replace('vt ', '').split(' ')
                    tmp = tmp.map(t => parseFloat(t))
                    texcoords.push(tmp)
                } else if(line.startsWith('vn ')) {
                    let tmp = line.replace('vn ', '').split(' ')
                    tmp = tmp.map(t => parseFloat(t))
                    normals.push(tmp)
                }
            } else {
                if(line.startsWith('f ')) {
                    let faces = line.replace('f ', '').split(' ')
                    faces.forEach(face => {
                        const [pIdx, tIdx, nIdx] = face.split('/').map(n => parseInt(n) - 1)
                        const position = positions[pIdx]
                        const texcoord = texcoords[tIdx]
                        const normal = normals[nIdx]
                        vertexData.push({
                            position,
                            texcoord,
                            normal,
                        })
                    })
                }
            }


        })
        this.mVertexBuffer.setSize(vertexData.length)
        vertexData.forEach((n, i) => {
            this.mVertexBuffer.setPosition(i, ...n.position);
            this.mVertexBuffer.setNormal(i, ...n.normal);
            this.mVertexBuffer.setTexcoord(i, ...n.texcoord);
        })
        // console.log('debug this.mVertexBuffer', this.mVertexBuffer)
        const bufferData = this.mVertexBuffer.getData()
        this.vbo = createBufferObject(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW)
    }

    active() {

    }

    render(m, v, p) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        this.shader.active()
        this.shader.setMVP(m, v, p)
        gl.uniform4f(gl.getUniformLocation(this.shader.mProgram, 'U_AmbientLight'), 0.1, 0.1, 0.1, 1.0)
        gl.uniform4f(gl.getUniformLocation(this.shader.mProgram, 'U_AmbientMaterial'), 0.1, 0.1, 0.1, 1.0)

        gl.uniform4f(gl.getUniformLocation(this.shader.mProgram, 'U_DiffuseLight'), 0.8, 0.8, 0.8, 1.0)
        gl.uniform4f(gl.getUniformLocation(this.shader.mProgram, 'U_DiffuseMaterial'), 0.4, 0.4, 0.4, 1.0)
        gl.uniform4f(gl.getUniformLocation(this.shader.mProgram, 'U_LightPos'), 0.0, 1.0, 0.0, 0.0)
        gl.drawArrays(gl.TRIANGLES, 0, this.mVertexBuffer.vertexData.length)
    }

    unActive() {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

