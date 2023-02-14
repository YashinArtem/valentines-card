import { quadPositions } from './quad-positions';
import { QuadProgram } from './quad-program';

export class Render {
    private readonly canvas: HTMLCanvasElement;
    private readonly gl: WebGLRenderingContext;
    
    private positionBuffer: WebGLBuffer;

    private quadProgram: QuadProgram;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2');
        this.resize(this.gl.canvas.width, this.gl.canvas.height);
        this.initBuffers();
        this.quadProgram = new QuadProgram();
        this.quadProgram.updateProgram(this.gl);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }

    public resize(width: number, height: number): void {
        this.gl.canvas.width = width;
        this.gl.canvas.height = height;
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
      }

    public clear(color: [number, number, number]): void {
        this.gl.clearColor(...color, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    public prepareQuads(): void {
        this.gl.useProgram(this.quadProgram.getProgram());
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.quadProgram.getPositionAttribute());
        this.gl.vertexAttribPointer(this.quadProgram.getPositionAttribute(), 2, this.gl.FLOAT, false, 0, 0);
    }

    public drawQuad(mouseX: number, mouseY: number, side: number, time: number): void {
        this.gl.uniform2f(this.quadProgram.getResolutionUniform(), this.canvas.width, this.canvas.height);
        this.gl.uniform2f(this.quadProgram.getMouseUniform(), mouseX, mouseY);
        this.gl.uniform1f(this.quadProgram.getSideUniform(), side);
        this.gl.uniform1f(this.quadProgram.getTimeUniform(), time);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    private initBuffers(): void {
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(quadPositions), this.gl.STATIC_DRAW);
    }
}