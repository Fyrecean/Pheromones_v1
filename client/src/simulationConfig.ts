import { config } from "../node_modules/webpack/types";
import { togglePause, reset, start } from "./main";

export interface ISimulationParameters {
    agentCount: number
    width: number,
    height: number,
    turnJitter: number,
    steerFactor: number,
    sampleDistance: number,
    passiveAttenuation: number,
    gaussianStdDev: number,
}

export const simulationParameters: ISimulationParameters = {
    agentCount: 100_000,
    height: 0,
    width: 0,
    turnJitter: 0,
    steerFactor: .5,
    sampleDistance: 5,
    passiveAttenuation: 0.001,
    gaussianStdDev: 0.4,
}

const configTable = document.getElementById("configTable");
let showConfig = false;
document.addEventListener("DOMContentLoaded", () => {
    let showButton = document.getElementById("show");
    showButton.addEventListener("click", () => {
        if (showConfig) {
            showConfig = false;
            configTable.hidden = false;
        } else {
            showConfig = true;
            configTable.hidden = true;
        }
    });
    addSlider("Jitter", "turnJitter", .5, 0, 1.5, .01);
    addSlider("Steering", "steerFactor", 0.25, 0, 1, .01);
    addSlider("Seeing Distance", "sampleDistance", 10, 1, 100, 1);  
    addSlider("Pheromone Blur", "gaussianStdDev", 0.05, 0, .5, .005);
    addSlider("Pheromone Fade", "passiveAttenuation", .008, 0.002, .05, .001);

    document.getElementById("reset").addEventListener("click", reset);
    let pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", () => {
        let isPlaying = togglePause();
        pauseButton.innerText = isPlaying ? "Pause" : "Unpause";
    });

    start();
}); 

function addSlider(name: string, configKey: keyof(ISimulationParameters),initialValue: number, min: number, max: number, step: number, onUpdate?: () => void): void {
    const sliderLabel = document.createElement("label");
    sliderLabel.setAttribute("for", name);
    sliderLabel.innerText = name;
    const sliderInput = document.createElement("input");
    sliderInput.setAttribute("id", name);
    sliderInput.setAttribute("type", "range");
    sliderInput.setAttribute("min", String(min));
    sliderInput.setAttribute("max", String(max));
    sliderInput.setAttribute("step", String(step));
    sliderInput.setAttribute("value", String(initialValue));
    const sliderDisplay = document.createElement("span");

    const tableRow = document.createElement("tr");
    tableRow.append(
        document.createElement("td").appendChild(sliderLabel).parentElement,
        document.createElement("td").appendChild(sliderInput).parentElement,
        document.createElement("td").appendChild(sliderDisplay).parentElement,
    );
    configTable.appendChild(tableRow);

    if (onUpdate) {

    } else {

    }
    onUpdate = () => {
        simulationParameters[configKey] = Number(sliderInput.value);
        sliderDisplay.innerText = sliderInput.value;
    };
    onUpdate();
    sliderInput.addEventListener("input", onUpdate);
}

export function getAgentsArray(parameters: ISimulationParameters): number[] {
    const agentsArray = new Array(4 * parameters.agentCount);
    for (let i = 0; i < parameters.agentCount * 4; i += 4) {
        agentsArray[i] = parameters.width / 2;
        agentsArray[i+1] = parameters.height / 2;
        agentsArray[i+2] = Math.random() - .5;
        agentsArray[i+3] = Math.random() - .5;
    }
    return agentsArray;
}