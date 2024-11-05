import { camera } from "./camera";

export function handleZoom(ev: WheelEvent) {
    ev.preventDefault();
    camera.zoom(ev.offsetX, ev.offsetY, ev.deltaY / 60);
}

export function handleTranslate(ev: MouseEvent) {
    if (ev.buttons === 1) {
        camera.translate(ev.movementX, ev.movementY);
    }
}