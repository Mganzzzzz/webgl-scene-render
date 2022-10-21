export class VertexData {
    static  SIZE = 0

    constructor() {
        this.mPosition = [0, 0, 0, 1]
        this.mColor = [1, 1, 1, 1]
        this.mTexcoord = [0, 0]
        this.mNormal = [0, 0, 0, 0]
    }

    setPosition(x, y, z, w = 1.0) {
        this.mPosition[0] = x
        this.mPosition[1] = y
        this.mPosition[2] = z
        this.mPosition[3] = w
    }

    setColor(r, g, b, a = 1.0) {
        this.mColor[0] = r || 1.0
        this.mColor[1] = g || 1.0
        this.mColor[2] = b || 1.0
        this.mColor[3] = a
    }

    setTexcoord(u, v) {
        this.mTexcoord[0] = u
        this.mTexcoord[1] = v
    }

    setNormal(r, g, b, a = 1.0) {
        this.mNormal[0] = r || 0.0
        this.mNormal[1] = g || 0.0
        this.mNormal[2] = b || 0.0
        this.mNormal[3] = a || 1.0
    }


    getData() {
        const arr = [
            this.mPosition,
            this.mColor,
            this.mTexcoord,
            this.mNormal,
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
