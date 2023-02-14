export class MouseHandler {

    private mouseX: number;
    private mouseY: number;

    private mousePressed: boolean;

    private rect: DOMRect;

    constructor(canvas: HTMLCanvasElement) {
        this.mouseX = 0;
        this.mouseY = 0;
        this.mousePressed = false;
        this.rect = canvas.getBoundingClientRect();
        document.addEventListener('mousemove', (e: MouseEvent) => this.mouseMove(e));
        document.addEventListener('mousedown', (e: MouseEvent) => this.mouseDown(e));
        document.addEventListener('mouseup', (e: MouseEvent) => this.mouseUp(e));
    }

    public dispose(): void {
        document.removeEventListener('mousemove', this.mouseMove);
        document.removeEventListener('mousedown', this.mouseDown);
        document.removeEventListener('mouseup', this.mouseUp);
    }

    public getMousePosition(): [number, number] {
        return [this.mouseX, this.mouseY];
    }

    public getMousePressed(): boolean {
        return this.mousePressed;
    }

    private mouseMove(e: MouseEvent): void {
        this.mouseX = e.clientX - this.rect.x;
        this.mouseY = e.clientY - this.rect.y;
    }
    
    private mouseDown(e: MouseEvent): void {
        if(e.button === 0) this.mousePressed = true;
    }
    
    private mouseUp(e: MouseEvent): void {
        if(e.button === 0) this.mousePressed = false;
    }
}