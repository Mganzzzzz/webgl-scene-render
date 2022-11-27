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
        this.mbEnableDepthTest = true;
        this.mbEnableProgramablePointSize = false;
        this.mbEnableBlend = false;
        this.mSRCBlendFunc = gl.SRC_ALPHA;
        this.mDSTBlendFunc = gl.ONE_MINUS_SRC_ALPHA;
        this.depthMask = true
        this.cullFace = true

        this.shader = null
        this.vec4PropertyMap = {}
        this.mat4PropertyMap = {}
        this.texturePropertyMap = {}
        this.textureCubePropertyMap = {}
    }

    init(shader) {
        this.shader = shader
    }


    setVec4(name, vec4) {

        let prop = null
        if(this.vec4PropertyMap[name]) {
            prop = this.vec4PropertyMap[name]
        } else {
            const location = gl.getUniformLocation(this.shader.mProgram, name)
            if(location instanceof WebGLUniformLocation) {
                prop = new Vec4Property()
                prop.location = location
                prop.name = name
                this.vec4PropertyMap[name] = prop
            }
        }

        if(prop) {
            prop.vec4 = vec4
        }
    }

    setMat4(name, mat4) {
        let prop = null
        if(this.mat4PropertyMap[name]) {
            prop = this.mat4PropertyMap[name]
        } else {
            const location = gl.getUniformLocation(this.shader.mProgram, name)
            if(location instanceof WebGLUniformLocation) {
                prop = new Mat4Property()
                prop.location = location
                prop.name = name
                this.mat4PropertyMap[name] = prop
            }
        }
        if(prop) {
            prop.mat4 = mat4
        }
    }

    setTexture(name, texture) {
        let prop = null
        if(this.texturePropertyMap[name]) {
            prop = this.texturePropertyMap[name]
        } else {
            const location = gl.getUniformLocation(this.shader.mProgram, name)
            if(location instanceof WebGLUniformLocation) {
                prop = new TextureProperty()
                prop.location = location
                prop.name = name
                this.texturePropertyMap[name] = prop
            }
        }

        if(prop) {
            prop.texture = texture
        }
    }

    setTextureCube(name, texture) {
        let prop = null
        if(this.textureCubePropertyMap[name]) {
            prop = this.textureCubePropertyMap[name]
        } else {
            const location = gl.getUniformLocation(this.shader.mProgram, name)
            if(location instanceof WebGLUniformLocation) {
                prop = new TextureProperty()
                prop.location = location
                prop.name = name
                this.textureCubePropertyMap[name] = prop
            }
        }

        if(prop) {
            prop.texture = texture
        }
    }


    active(v, p) {
        if(this.mbEnableDepthTest) {
            gl.enable(gl.DEPTH_TEST);
        } else {
            gl.disable(gl.DEPTH_TEST);
        }
        // if (this.mbEnableProgramablePointSize) {
        //     gl.enable(gl.PROGRAM_POINT_SIZE);
        // } else {
        //     gl.disable(gl.PROGRAM_POINT_SIZE);
        // }


        if(this.mbEnableBlend) {
            gl.enable(gl.BLEND);
            gl.blendFunc(this.mSRCBlendFunc, this.mDSTBlendFunc);
        } else {
            gl.disable(gl.BLEND);
        }
        if(this.cullFace) {
            gl.enable(gl.CULL_FACE)
        } else {
            gl.disable(gl.CULL_FACE)
        }

        gl.depthMask(this.depthMask)

        this.shader.active()
        this.shader.setMVP(this.mat4PropertyMap['M'].mat4, v, p)
        Object.values(this.mat4PropertyMap).forEach((prop) => {
            gl.uniformMatrix4fv(prop.location, false, prop.mat4)

        })

        Object.values(this.vec4PropertyMap).forEach((prop) => {
            if(prop.location) {
                gl.uniform4fv(prop.location, prop.vec4)
            }
        })
        let mSlotIndex = 0;
        Object.values(this.texturePropertyMap).forEach((item) => {
            gl.activeTexture(gl.TEXTURE0 + mSlotIndex);
            gl.bindTexture(gl.TEXTURE_2D, item.texture);
            /// 通过采样器传输纹理
            gl.uniform1i(item.location, mSlotIndex);
        })

        Object.values(this.textureCubePropertyMap).forEach((item) => {
            gl.activeTexture(gl.TEXTURE0 + mSlotIndex);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, item.texture);
            /// 通过采样器传输纹理
            gl.uniform1i(item.location, mSlotIndex);
        })

    }


    unActive() {
        this.shader.unActive()
    }
}
