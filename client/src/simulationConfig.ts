import { config } from "../node_modules/webpack/types";

export interface ISimulationParameters {
    agentCount: number
    width: number,
    height: number,
    turnJitter: number,
    steerFactor: number,
    sampleDistance: number,
    passiveAttenuation: number,
}

export const simulationParameters: ISimulationParameters = {
    agentCount: 100,
    height: 0,
    width: 0,
    turnJitter: 0,
    steerFactor: .5,
    sampleDistance: 5,
    passiveAttenuation: .001,
}

document.addEventListener("DOMContentLoaded", () => {
    addSlider("Jitter", "turnJitter", 0.5, 0, 1.5);
    addSlider("Steering", "steerFactor", 0.5, 0, 1);
}); 

const configPanel = document.getElementById("config");
function addSlider(name: string, configKey: keyof(ISimulationParameters),initialValue: number, min: number, max: number): void {
    const sliderLabel = document.createElement("label");
    sliderLabel.setAttribute("for", name);
    sliderLabel.innerText = name;
    const sliderInput = document.createElement("input");
    sliderInput.setAttribute("id", name);
    sliderInput.setAttribute("type", "range");
    sliderInput.setAttribute("value", String(initialValue));
    sliderInput.setAttribute("step", String(0.01));
    sliderInput.setAttribute("min", String(min));
    sliderInput.setAttribute("max", String(max));
    const sliderDisplay = document.createElement("span");

    configPanel.append(sliderLabel, sliderInput, sliderDisplay);

    let onUpdate = () => {
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