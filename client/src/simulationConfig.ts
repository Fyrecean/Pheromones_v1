import { config } from "../node_modules/webpack/types";
import { togglePause, reset, start } from "./main";

export interface ISimulationParameters {
    agentCount: number
    width: number,
    height: number,
    turnJitter: number,
    steerFactor: number,
    acceleration: number,
    sampleDistance: number,
    passiveAttenuation: number,
    gaussianStdDev: number,
    wrap: number,
}

export const simulationParameters: ISimulationParameters = {
    agentCount: 100_000,
    height: 0,
    width: 0,
    turnJitter: 0,
    steerFactor: .5,
    acceleration: 0.,
    sampleDistance: 5,
    passiveAttenuation: 0.001,
    gaussianStdDev: 0.4,
    wrap: 1,
}

const configTable = document.getElementById("configTable");
let showConfig = false;
document.addEventListener("DOMContentLoaded", () => {
    let showButton = document.getElementById("show");
    showButton.addEventListener("click", () => {
        if (showConfig) {
            showConfig = false;
            showButton.innerText = "Hide Config";
            configTable.hidden = false;
        } else {
            showConfig = true;
            showButton.innerText = "Show Config";
            configTable.hidden = true;
        }
    });
    addSlider("Jitter", "turnJitter", .75, 0, 1.5, .01,
        "How much do ants randomly change direction"
    );
    addSlider("Steering", "steerFactor", 0.15, 0, 1, .01, 
        "How much do ants steer towards detected pheromones"
    );
    addSlider("Acceleration", "acceleration", 3, 0, 8, .1,
        "How much do ants speed up when they detect pheromones in front of them"
    );  
    addSlider("Detection Distance", "sampleDistance", 20, 1, 75, 1,
        "How many pixels away can ants detect pheromones"
    );  
    addSlider("Pheromone Blur", "gaussianStdDev", 0.25, 0, .5, .005,
        "How quickly pheromones diffuse by changing the std deviation of a gaussian distribution"
    );
    addSlider("Pheromone Fade", "passiveAttenuation", .01, 0.002, .05, .001,
        "Amount by which all pheromones are decreased each frame"
    );
    addCheckbox("Wrap Around", "wrap", false,
        "Whether ants bounce off the edges or wrap around to the other side"
    );
    
    document.getElementById("reset").addEventListener("click", reset);
    let pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", () => {
        let isPlaying = togglePause();
        pauseButton.innerText = isPlaying ? "Pause" : "Unpause";
    });

    start();
}); 

function addSlider(name: string, configKey: keyof(ISimulationParameters),initialValue: number, min: number, max: number, step: number, tooltip: string): void {
    const sliderLabel = document.createElement("label");
    sliderLabel.setAttribute("for", name);
    sliderLabel.setAttribute("title", tooltip);
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

    const onUpdate = () => {
        simulationParameters[configKey] = Number(sliderInput.value);
        sliderDisplay.innerText = sliderInput.value;
    };
    onUpdate();
    sliderInput.addEventListener("input", onUpdate);

}

function addCheckbox(name: string, configKey: keyof(ISimulationParameters), initialValue: boolean, tooltip: string) {
    const label = document.createElement("label");
    label.setAttribute("for", name);
    label.setAttribute("title", tooltip);
    label.innerText = name;
    const input = document.createElement("input");
    input.setAttribute("id", name);
    input.setAttribute("type", "checkbox");
    input.checked = initialValue;

    const tableRow = document.createElement("tr");
    tableRow.append(
        document.createElement("td").appendChild(label).parentElement,
        document.createElement("td").appendChild(input).parentElement,
    );
    configTable.appendChild(tableRow);

    const onUpdate = () => {
        simulationParameters[configKey] = input.checked ? 1 : 0;
    };
    onUpdate();
    input.addEventListener("input", onUpdate);
}

export function getAgentsArray(parameters: ISimulationParameters): number[] {
    const agentsArray = new Array(4 * parameters.agentCount);
    for (let i = 0; i < parameters.agentCount * 4; i += 4) {
        agentsArray[i] = parameters.width / 2;
        agentsArray[i+1] = parameters.height / 2;
        agentsArray[i+2] = Math.random()-.5;
        agentsArray[i+3] = Math.random()-.5 ;
    }
    return agentsArray;
}