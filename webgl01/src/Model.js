import {createBufferObject, loadFileFromUrl} from "./utils";
import {VertexBuffer} from "./VertexBuffer";
import {Geometry} from "./Geometry";
import {degToRad} from "./math/math_utils";
import {MouseClickType} from "./constant";

// import Quad from './static/Quad.obj'

export class Model extends Geometry {
    constructor() {
        super()
        this.vbo = null
        this.mVertexBuffer = new VertexBuffer()
        this.mAmbientMaterial = [0, 0, 0, 0]
        this.mDiffuseMaterial = [0, 0, 0, 0]
        this.mSpecularMaterial = [0, 0, 0, 0]
        this.sceneNode = null
        this.leftMouseDown = false
        this.startPoint = null
    }

    async init(modelPath, sceneNode) {
        this.sceneNode = sceneNode
        const positions = []
        const texcoords = []
        const normals = []
        const vertexData = []
        const file = await loadFileFromUrl(modelPath)
        const lines = file.split('\n')
        lines.forEach(line => {
            if (line.startsWith('v')) {
                if (line.startsWith('v ')) {
                    let tmp = line.replace('v ', '').split(' ').filter(n => n).map(n => n.trim())
                    tmp = tmp.map(t => parseFloat(t))
                    positions.push(tmp)
                } else if (line.startsWith('vt ')) {
                    let tmp = line.replace('vt ', '').split(' ').filter(n => n).map(n => n.trim())
                    tmp = tmp.map(t => parseFloat(t))
                    texcoords.push(tmp)
                } else if (line.startsWith('vn ')) {
                    let tmp = line.replace('vn ', '').split(' ').filter(n => n).map(n => n.trim())
                    tmp = tmp.map(t => parseFloat(t))
                    normals.push(tmp)
                }
            } else {
                if (line.startsWith('f ')) {
                    let faces = line.replace('f ', '').split(' ')
                    faces.forEach(face => {
                        let [pIdx, tIdx, nIdx] = face.split('/').map(n => parseInt(n) - 1)
                        const position = positions[pIdx]
                        let texcoord = texcoords[tIdx]
                        const normal = normals[nIdx]
                        if (position && normal && texcoord) {
                            vertexData.push({
                                position,
                                texcoord,
                                normal,
                            })
                        }
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

    update(v, p) {
        if (this.sceneNode.mModelMatrix) {
            // this.sceneNode.mModelMatrix = m4.yRotate(this.sceneNode.mModelMatrix, degToRad(-0.15))
        }
    }

    active() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    }

    render() {
        gl.drawArrays(gl.TRIANGLES, 0, this.mVertexBuffer.vertexData.length)
    }

    unActive() {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

