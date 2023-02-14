import { MouseHandler } from './controls/mouse-handler';
import { Render } from './rendering/render';

const cnv: HTMLCanvasElement = document.getElementById('cnv') as HTMLCanvasElement;
cnv.width = window.innerWidth * window.devicePixelRatio;
cnv.height = window.innerHeight * window.devicePixelRatio;

const render: Render = new Render(cnv);
const mouseHandler: MouseHandler = new MouseHandler(cnv);

let cardSide: number = 0;
let selectedCardSide: number = 0;

window.addEventListener('resize', () => {
    render.resize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
});

window.addEventListener('pointerdown', () => {
    selectedCardSide = 1 - selectedCardSide;
});

const update: () => void = () => {
    const mousePosition: [number, number] = mouseHandler.getMousePosition();
    const mouseX: number = mousePosition[0] / cnv.width * 4 - 1;
    const mouseY: number = 0.5 - mousePosition[1] / cnv.height * 2;
    render.clear([1, 1, 1]);
    render.prepareQuads();
    render.drawQuad(mouseX, mouseY, cardSide, performance.now() / 1000);
    cardSide = cardSide * 0.95 + selectedCardSide * 0.05;
    requestAnimationFrame(update);
};

update();