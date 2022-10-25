import {VertexData} from "./VertexBuffer";

const FSIZE = Float32Array.BYTES_PER_ELEMENT

export class Shader {
    constructor() {
        this.mProgram = -1
        this.mPositionLocation = -1
        this.mColorLocation = -1
        this.mTexcoordLocation = -1
        this.mNormalLocation = -1
        this.mMLocation = -1
        this.mPLocation = -1
        this.mVLocation = -1
        this.mProjectionMatrix = null
        this.mViewMatrix = null
        this.mModelMatrix = null
        this.mSlotIndex = 0
    }


    initStandardShader(vs_path, fs_path) {
        this.mProgram = webglUtils.createProgramFromScripts(gl, [vs_path, fs_path]);
        const {mProgram} = this
        this.mPositionLocation = gl.getAttribLocation(mProgram, "position");
        this.mColorLocation = gl.getAttribLocation(mProgram, "color");
        this.mTexcoordLocation = gl.getAttribLocation(mProgram, "texcoord");
        this.mNormalLocation = gl.getAttribLocation(mProgram, "normal");
        this.mMLocation = gl.getUniformLocation(mProgram, "M");
        this.mPLocation = gl.getUniformLocation(mProgram, "P");
        this.mVLocation = gl.getUniformLocation(mProgram, "V");
        this.mIT_ModelMatrixLocation = gl.getUniformLocation(mProgram, "IT_M");
    }

    setMVP(m, v, p) {
        const {
            mMLocation,
            mPLocation,
            mVLocation,
        } = this
        this.mModelMatrix = m
        this.mViewMatrix = v
        this.mProjectionMatrix = p
        gl.uniformMatrix4fv(mMLocation, false, m);
        gl.uniformMatrix4fv(mVLocation, false, v);
        gl.uniformMatrix4fv(mPLocation, false, p);

        // let it_m = m4.transpose(m)
        // it_m = m4.inverse(it_m)

        let it_m = m4.inverse(m)
        it_m = m4.transpose(it_m)
        if (this.mIT_ModelMatrixLocation > 0) {
            gl.uniformMatrix4fv(this.mIT_ModelMatrixLocation, false, it_m)
        }
    }

    setTexture(sampler_name, texture) {
        /// 激活纹理单元
        gl.activeTexture(gl.TEXTURE0 + this.mSlotIndex);
        /// 绑定纹理
        gl.bindTexture(gl.TEXTURE_2D, texture);
        /// 通过采样器传输纹理
        gl.uniform1i(gl.getUniformLocation(this.mProgram, sampler_name), this.mSlotIndex);
        this.mSlotIndex++;
    }

    active() {
        this.mSlotIndex = 0;
        gl.useProgram(this.mProgram);
        gl.enableVertexAttribArray(this.mPositionLocation);/// 启用shader 里面的 顶点数组 名字是position
        /// 配置顶点数据 参数分别是 shader插槽位置，4个浮点数，是否归一化， 每个顶点之间的间隔(或者每个顶点的大小)， 起始位置偏移
        gl.vertexAttribPointer(this.mPositionLocation, 4, gl.FLOAT, false, VertexData.SIZE, 0);

        if (this.mColorLocation > 0) {
            gl.enableVertexAttribArray(this.mColorLocation);
            gl.vertexAttribPointer(this.mColorLocation, 4, gl.FLOAT, false, VertexData.SIZE, FSIZE * 4);
        }

        if (this.mTexcoordLocation > 0) {
            gl.enableVertexAttribArray(this.mTexcoordLocation);
            gl.vertexAttribPointer(this.mTexcoordLocation, 4, gl.FLOAT, false, VertexData.SIZE, FSIZE * 8);
        }

        if (this.mNormalLocation > 0) {
            gl.enableVertexAttribArray(this.mNormalLocation);
            gl.vertexAttribPointer(this.mNormalLocation, 4, gl.FLOAT, false, VertexData.SIZE, FSIZE * 12);
        }
    }

    unActive() {
        gl.useProgram(null)
    }

}
