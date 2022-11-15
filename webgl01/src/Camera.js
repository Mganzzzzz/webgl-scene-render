export class Camera {
    constructor() {
        this.speed = 30
        this.originPoint = {
            clientX: 0,
            clientY: 0,
        }
        this.mPosition = ([0, 0, 10])
        this.mViewCenter = ([0, 0, -1])
        this.mUp = ([0, 1, 0])
        // this.load()
        this.mbForward = false
        this.mbBackward = false
        this.mbLeft = false
        this.mbRight = false
        this.isRotateView = false

        this.mViewMatrix = m4.lookAt(this.mPosition, this.mViewCenter, this.mUp);
    }

    update(deltatime) {
        let speed = this.speed
        // 计算出视线的向量
        let forwardDirection = m4.subtractVectors(this.mViewCenter, this.mPosition)
        forwardDirection = m4.normalize(forwardDirection);
        // 计算出右手的向量 用视线向量 叉除 up向量
        let rightDirection = m4.cross(forwardDirection, this.mUp);
        rightDirection = m4.normalize(rightDirection);
        // console.log('debug rightDirection', rightDirection)

        if (this.mbForward) {
            let delta = m4.multiplyNumber(forwardDirection, deltatime * speed);
            this.mPosition = m4.addVectors(this.mPosition, delta);
            this.mViewCenter = m4.addVectors(this.mViewCenter, delta);
        }
        if (this.mbBackward) {
            let delta = m4.multiplyNumber(forwardDirection, deltatime * speed);
            this.mPosition = m4.subtractVectors(this.mPosition, delta);
            this.mViewCenter = m4.subtractVectors(this.mViewCenter, delta);
        }
        if (this.mbLeft) {
            let delta = m4.multiplyNumber(rightDirection, deltatime * speed);
            this.mPosition = m4.subtractVectors(this.mPosition, delta);
            this.mViewCenter = m4.subtractVectors(this.mViewCenter, delta);
        }
        if (this.mbRight) {
            let delta = m4.multiplyNumber(rightDirection, deltatime * speed);
            this.mPosition = m4.addVectors(this.mPosition, delta);
            this.mViewCenter = m4.addVectors(this.mViewCenter, delta);
        }

        this.mViewMatrix = m4.lookAt(this.mPosition, this.mViewCenter, this.mUp);
        this.save()
    }

    load() {
        let s = sessionStorage.getItem('camera')
        if (s) {
            s = JSON.parse(s)
            const [a, b, c] = s
            this.mPosition = a
            this.mViewCenter = b
            this.mUp = c
        }
    }

    save() {
        const a = [this.mPosition, this.mViewCenter, this.mUp]
        const s = JSON.stringify(a)
        sessionStorage.setItem('camera', s)
    }

    yaw(angle) {
        const [x, y, z] = this.mUp
        this.rotateView(angle, x, y, z);
    }

    pitch(angle) {
        let forwardDirection = m4.subtractVectors(this.mViewCenter, this.mPosition)
        forwardDirection = m4.normalize(forwardDirection);
        // 计算出右手的向量 用视线向量 叉除 up向量
        let rightDirection = m4.cross(forwardDirection, this.mUp);
        rightDirection = m4.normalize(rightDirection);
        let [x, y, z] = rightDirection
        this.rotateView(angle, x, y, z);
    }

    rotateView(angle, x, y, z) {
        // 获取视线
        let forwardDirection = m4.subtractVectors(this.mViewCenter, this.mPosition)
        let C = Math.cos(angle);
        let S = Math.sin(angle);
        // 根据公式的旋转矩阵乘以旋转的方向向量得出新的视线向量
        //和旋转矩阵相乘
        let tempX = [C + x * x * (1 - C), x * y * (1 - C) - z * S, x * z * (1 - C) + y * S]
        let tempY = [x * y * (1 - C) + z * S, C + y * y * (1 - C), y * z * (1 - C) - x * S]
        let tempZ = [x * z * (1 - C) - y * S, y * z * (1 - C) + x * S, C + z * z * (1 - C)]
        // 新的视线向量
        let newViewDirection = [m4.multiplyVectors(tempX, forwardDirection), m4.multiplyVectors(tempY, forwardDirection), m4.multiplyVectors(tempZ, forwardDirection)];
        this.mViewCenter = m4.addVectors(this.mPosition, newViewDirection);
        // console.log('debug this.mViewCenter', this.mViewCenter)
        // console.log('debug ', )
    }

    onMouseDownEvent(e) {
        this.originPoint.clientX = e.clientX
        this.originPoint.clientY = e.clientY
        this.isRotateView = true
    }

    onMouseUpEvent(e) {
        this.originPoint.clientX = e.clientX
        this.originPoint.clientY = e.clientY
        this.isRotateView = false
    }

    onMouseMoveEvent(e) {
        if (this.isRotateView) {

            let deltaX = e.clientX - this.originPoint.clientX
            let deltaY = e.clientY - this.originPoint.clientY
            let angleRight = deltaY / 1000
            let angleUp = deltaX / 1000
            this.yaw(angleUp)
            this.pitch(angleRight)
            this.originPoint.clientX = e.clientX
            this.originPoint.clientY = e.clientY
        }
    }


    inKeyEvent(e) {
        const {key, type} = e
        const t = type === 'keydown'
        if (key === 'w') {
            this.mbForward = t
        }
        if (key === 's') {
            this.mbBackward = t

        }
        if (key === 'a') {
            this.mbLeft = t
        }
        if (key === 'd') {
            this.mbRight = t
        }
    }
}
