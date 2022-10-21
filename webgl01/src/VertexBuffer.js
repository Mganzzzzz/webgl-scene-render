export class VertexData {
    static  SIZE = 0

    constructor() {
        this.mPosition = []
        this.mColor = []
        this.mTexcoord = []
        this.mNormal = []
    }

    setPosition(x, y, z, w = 1.0) {
        this.mPosition[0] = x
        this.mPosition[1] = y
        this.mPosition[2] = z
        this.mPosition[3] = w
    }

    setColor(r, g, b, a = 1.0) {
        this.mColor[0] = r
        this.mColor[1] = g
        this.mColor[2] = b
        this.mColor[3] = a
    }

    setTexcoord(u, v) {
        this.mTexcoord[0] = u
        this.mTexcoord[1] = v
    }

    setNormal(r, g, b, a = 1.0) {
        this.mNormal[0] = r
        this.mNormal[1] = g
        this.mNormal[2] = b
        this.mNormal[3] = a
    }


    getData() {
        const arr = [
            this.mPosition,
            this.mColor,
            this.mTexcoord,
            // this.mNormal,
        ]
        const ret = arr.flat()
        VertexData.SIZE = Float32Array.BYTES_PER_ELEMENT * ret.length
        return ret
    }
}


export class VertexBuffer {
    constructor() {
        this.vertexData = []
    }

    setSize(vertexCount) {
        this.vertexData = Array(vertexCount).fill(0).map(n => new VertexData())
    }

    setPosition(index, x, y, z, w = 1.0) {
        this.vertexData[index].setPosition(x, y, z, w)
    }

    setColor(index, r, g, b, a = 1.0) {
        this.vertexData[index].setColor(r, g, b, a)
    }

    setTexcoord(index, u, v) {
        this.vertexData[index].setTexcoord(u, v)
    }

    setNormal(index, r, g, b, a = 1.0) {
        this.vertexData[index].setNormal(r, g, b, a)
    }

    getData() {
        const ret = this.vertexData.map(n => n.getData())
        return ret.flat()
    }
}
