export class Vec4Property {
    constructor() {
        this.location = null
        this.name = ''
        this.vec4 = null
    }
}

export class Mat4Property {
    constructor() {
        this.location = null
        this.name = ''
        this.mat4 = null
    }
}

export class TextureProperty {
    constructor() {
        this.location = null
        this.name = ''
        this.texture = null
    }
}

export class Material {
    constructor() {
        this.shader = null
        this.vec4PropertyMap = {}
        this.mat4PropertyMap = {}
        this.texturePropertyMap = {}
    }

    init(shader) {
        this.shader = shader
    }


    setVec4(name, vec4) {

        let prop = null
        if (this.vec4PropertyMap[name]) {
            prop = this.vec4PropertyMap[name]
        } else {
            const location = gl.getUniformLocation(this.shader.mProgram, name)
            if (location instanceof WebGLUniformLocation) {
                prop = new Vec4Property()
                prop.location = location
                prop.name = name
                this.vec4PropertyMap[name] = prop
            }
        }

        if (prop) {
            prop.vec4 = vec4
        }
    }

    setMat4(name, mat4) {
        let prop = null
        if (this.mat4PropertyMap[name]) {
            prop = this.mat4PropertyMap[name]
        } else {
            const location = gl.getUniformLocation(this.shader.mProgram, name)
            if (location instanceof WebGLUniformLocation) {
                prop = new Mat4Property()
                prop.location = location
                prop.name = name
                this.mat4PropertyMap[name] = prop
            }
        }
        if (prop) {
            prop.mat4 = mat4
        }
    }

    setTexture(name, texture) {
        let prop = null
        if (this.texturePropertyMap[name]) {
            prop = this.texturePropertyMap[name]
        } else {
            const location = gl.getUniformLocation(this.shader.mProgram, name)
            if (location instanceof WebGLUniformLocation) {
                prop = new TextureProperty()
                prop.location = location
                prop.name = name
                this.texturePropertyMap[name] = prop
            }
        }

        if (prop) {
            prop.texture = texture
        }
    }

    active(v, p) {
        this.shader.active()
        this.shader.setMVP(this.mat4PropertyMap['M'].mat4, v, p)
        Object.values(this.mat4PropertyMap).forEach((prop) => {
            gl.uniformMatrix4fv(prop.location, false, prop.mat4)

        })

        Object.values(this.vec4PropertyMap).forEach((prop) => {
            if (prop.location) {
                gl.uniform4fv(prop.location, prop.vec4)
            }
        })
        Object.values(this.texturePropertyMap).forEach((item, mSlotIndex) => {
            gl.activeTexture(gl.TEXTURE0 + mSlotIndex);
            gl.bindTexture(gl.TEXTURE_2D, item.texture);
            /// 通过采样器传输纹理
            gl.uniform1i(item.location, mSlotIndex);
        })

    }


    unActive() {
        this.shader.unActive()
    }
}
