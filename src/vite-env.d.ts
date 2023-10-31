/// <reference types="vite/client" />
interface resizeCanvasToDisplaySize {
    resizeCanvasToDisplaySize: (gl: HTMLCanvasElement) => void
}
const webglUtils: resizeCanvasToDisplaySize
const gl: WebGLRenderingContext
const canvas: HTMLCanvasElement

declare module '*.bmp';
