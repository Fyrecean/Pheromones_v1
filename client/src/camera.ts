import { simulationParameters } from "./simulationConfig";
import { mat4, Mat4, vec4 } from "wgpu-matrix";
import { debugMetrics } from "./debugMenu";

export class Camera2D {
    viewMatrix: Mat4;
    minZoom: number;
    maxZoom: number;
    _translationTether: number;
    get translationTether() {
        return this._translationTether * this.scale;
    }
    get positionX() {
        return this.viewMatrix[12];
    }
    get positionY() {
        return this.viewMatrix[13];
    }
    get scale() {
        return this.viewMatrix[0];
    }

    constructor(minZoom: number, maxZoom: number, translationTether: number) {
        this.viewMatrix = mat4.identity();
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this._translationTether = translationTether;

        debugMetrics.push({name: "Camera Scale", getter: () => this.scale.toString()});
        debugMetrics.push({name: "Camera X", getter: () => this.positionX.toString()});
        debugMetrics.push({name: "Camera Y", getter: () => this.positionY.toString()});
        debugMetrics.push({name: "Tether", getter: () => this.translationTether.toString()});

    }

    /**
     * @param x Pixel coordinates relative to simulationParameters
     * @param y Pixel coordinates relative to simulationParameters
     */
    translate(x: number, y: number) {
        let [xCamera, yCamera] = this.pixelDeltaToCamera(x, y);
        let newX = this.positionX + xCamera;
        if (newX < -this.translationTether) {
            xCamera = -this.translationTether - this.positionX;
        }
        if (newX > this.translationTether) {
            xCamera = this.translationTether - this.positionX;
        }
        let newY = this.positionY + yCamera;
        if (newY < -this.translationTether) {
            yCamera = -this.translationTether - this.positionY;
        }
        if (newY > this.translationTether) {
            yCamera = this.translationTether - this.positionY;
        }
        const translation = mat4.translation(vec4.fromValues(xCamera, yCamera, 0, 0));
        mat4.multiply(camera.viewMatrix, translation, camera.viewMatrix);
    }

    zoom(x: number, y: number, amount: number) {
        if (amount == 0) return;
        if (!(amount > 0 && this.scale <= this.maxZoom) && !(amount < 0 && this.scale >= this.minZoom)) {
            let [xCamera, yCamera] = this.pixelToCamera(x, y);
            const mouseToOrigin = mat4.translation(vec4.fromValues(xCamera, yCamera, 0, 0));
            let newScale = this.scale * (1 - amount);
            if (newScale > this.minZoom) {
                amount = -this.minZoom / this.scale + 1;
            } else if (newScale < this.maxZoom) {
                amount = -this.maxZoom / this.scale + 1;
            }
            const zoom = mat4.uniformScale(mat4.identity(), 1 - amount);
            [xCamera, yCamera] = this.pixelToCamera(x, y);
            const undoMouseToOrigin = mat4.translation(vec4.fromValues(-xCamera, -yCamera, 0, 0));
            mat4.multiply(camera.viewMatrix, mouseToOrigin, camera.viewMatrix);
            mat4.multiply(camera.viewMatrix, zoom, camera.viewMatrix);
            mat4.multiply(camera.viewMatrix, undoMouseToOrigin, camera.viewMatrix);
        }
    }

    pixelToCamera(x: number, y: number): [number, number] {
        const xNorm = (x / (simulationParameters.width) - .5) * 2;
        const yNorm = (-y / (simulationParameters.height) + .5) * 2;
        const canvasVector = vec4.fromValues(xNorm, yNorm, 0, 1);
        const worldVector = vec4.transformMat4(canvasVector,mat4.inverse(this.viewMatrix));
        return [worldVector[0], worldVector[1]];
    }
    
    pixelDeltaToCamera(x: number, y: number): [number, number] {
        return [
            x / simulationParameters.width * (2 / this.viewMatrix[0]), 
            -y / simulationParameters.height * (2 / this.viewMatrix[5])
        ];
    }
}

export const camera: Camera2D = new Camera2D(8, 1, 1);