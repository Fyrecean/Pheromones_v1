import { Vec3 } from "wgpu-matrix";
import { togglePause, reset, start } from "./main";

export interface IPheromoneLayer {
    color: Vec3
}

export interface ISimulationParameters {
    agentCount: number
    width: number,
    height: number,
    turnJitter: number,
    steerFactor: number,
    speed: number,
    acceleration: number,
    sampleDistance: number,
    sampleAngle: number,
    passiveAttenuation: number,
    gaussianStdDev: number,
    wrap: boolean,
    pheromone_layers: IPheromoneLayer[]
}


export let simulationParameters: ISimulationParameters = {
    agentCount: 100_000,
    height: 0,
    width: 0,

    turnJitter: .6,
    steerFactor: .6,
    speed: .8,
    acceleration: .3,
    sampleDistance: 17,
    sampleAngle: .4,
    passiveAttenuation: 0.01,
    gaussianStdDev: .4,
    wrap: true,
    pheromone_layers: []
}
const defaultParams = structuredClone(simulationParameters);

const animalNames: string[] = [
    "Tiger",
    "Spider",
    "Bear",
    "Lion",
    "Elephant",
    "Giraffe",
    "Wolf",
    "Fox",
    "Rabbit",
    "Kangaroo",
    "Zebra",
    "Deer",
    "Leopard",
    "Panther",
    "Cheetah",
    "Eagle",
    "Falcon",
    "Hawk",
    "Owl",
    "Penguin",
    "Beetle",
    "Dolphin",
    "Shark",
    "Whale",
    "Octopus",
    "Lobster",
    "Crab",
    "Horse",
    "Cow",
    "Goat",
    "Sheep",
    "Chicken",
    "Duck",
    "Goose",
    "Turkey",
    "Peacock",
    "Bat",
    "Rat",
    "Mouse",
    "Squirrel",
    "Chipmunk",
    "Moose",
    "Bison",
    "Antelope",
    "Crocodile",
    "Alligator",
    "Tortoise",
    "Frog",
    "Toad",
    "Snake",
    "Lizard",
    "Ant"
];  

let configTable: HTMLTableElement;
let showConfig = false;

type cookieType = {[Name: string]: ISimulationParameters};

let savedCookies: cookieType = {};

function loadCookie() {
    const cookies = document.cookie.split("; ");
    cookies.forEach(cookie => {
        if (cookie.startsWith("savedConfigs")) {
            savedCookies = JSON.parse(cookie.split("savedConfigs: ")[1]) as cookieType;
        }
    });
}

function saveCookie() {
    document.cookie = "savedConfigs: "+JSON.stringify(savedCookies);
}

document.addEventListener("DOMContentLoaded", () => {
    configTable = document.getElementById("configTable") as HTMLTableElement;
    let saveButton = document.getElementById("saveConfig") as HTMLButtonElement;
    loadCookie();
    const configOptions = document.getElementById("savedConfigs") as HTMLSelectElement;
    const configName = document.getElementById("configName") as HTMLInputElement;
    configOptions.addEventListener("input", () => {
        if (configOptions.value == "+Create New") {
            let randomAnimal = animalNames[Math.floor(Math.random() * animalNames.length)];
            while (savedCookies[randomAnimal] != undefined) {
                randomAnimal = animalNames[Math.floor(Math.random() * animalNames.length)];
            }
            configOptions.prepend(new Option(randomAnimal));
            savedCookies[randomAnimal] = structuredClone(simulationParameters);
            configOptions.selectedIndex = 0;
        } else if (configOptions.value == "Default") {
            setSimulationParams(defaultParams);
        } else {
            setSimulationParams(savedCookies[configOptions.value]);
        }
        configName.value = configOptions.value;
        switch (configName.value) {
            case "Default":
            case "+Create New": {
                saveButton.setAttribute("disabled", "");
                configName.setAttribute("disabled", "");
            }
            default: {
                saveButton.removeAttribute("disabled");
                configName.removeAttribute("disabled");
            }
        }
    });

    for (let cookieName in savedCookies) {
        configOptions.appendChild(new Option(cookieName));
    }

    if (Object.keys(savedCookies).length < animalNames.length) {
        configOptions.appendChild(new Option("+Create New"));   
    }
            
    saveButton.addEventListener("click", () => {
        let name = configName.value;
        switch (name) {
            case "Default":
            case "+Create New": {
                return;
            }
        }
        let selected = configOptions.value;
        if (configOptions.value != name) {
            savedCookies[name] = structuredClone(simulationParameters);
            configOptions.options.item(configOptions.selectedIndex).innerText = name;
            delete savedCookies[selected];
        }
        savedCookies[name] = structuredClone(simulationParameters);
        saveCookie();
    });

    let showButton = document.getElementById("show");
    let configFlyout = document.getElementById("configFlyout");
    showButton.addEventListener("click", () => {
        if (showConfig) {
            showConfig = false;
            showButton.innerText = "Hide Config";
            configFlyout.style.display = "";
        } else {
            showConfig = true;
            showButton.innerText = "Show Config";
            configFlyout.style.display = "none";
        }
    });
    addSlider("Jitter", "turnJitter", 0, 1.5, .01,
        "How much do ants randomly change direction"
    );
    addSlider("Steering", "steerFactor", 0, 1, .01, 
        "How much do ants steer towards detected pheromones"
    );
    addSlider("Speed", "speed", .1, 2, .1, 
        "How fast they go"
    );
    addSlider("Acceleration", "acceleration", -1, 2, .1,
        "How much do ants speed up when they detect pheromones in front of them"
    );  
    addSlider("Detection Distance", "sampleDistance", 1, 75, 1,
        "How many pixels away can ants detect pheromones"
    );  
    addSlider("Detection Angle", "sampleAngle", 0.1, 2, .1,
        "Angle away from center to sample for pheromones in radians"
    );  
    addSlider("Pheromone Blur", "gaussianStdDev", 0, .5, .005,
        "How quickly pheromones diffuse by changing the std deviation of a gaussian distribution"
    );
    addSlider("Pheromone Fade", "passiveAttenuation", 0.002, .05, .001,
        "Amount by which all pheromones are decreased each frame"
    );
    addCheckbox("Wrap Around", "wrap",
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

interface ISimControl<T> {
    key: keyof ISimulationParameters,
    updater: (value: T) => void
}
const controls: ISimControl<unknown>[] = []

function setSimulationParams(newParameters: ISimulationParameters) {
    Object.assign(simulationParameters, newParameters);
    controls.forEach(control => control.updater(simulationParameters[control.key]));
}

type TypedKeys<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T]

function addSlider(name: string, configKey: TypedKeys<ISimulationParameters, number>, min: number, max: number, step: number, tooltip: string): void {
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
    sliderInput.setAttribute("value", String(simulationParameters[configKey]));
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
    controls.push({key: configKey, updater: (value: Number) => {
        sliderInput.value = String(value);
        sliderDisplay.innerText = sliderInput.value 
    }});
}

function addCheckbox(name: string, configKey: TypedKeys<ISimulationParameters, boolean>, tooltip: string) {
    const label = document.createElement("label");
    label.setAttribute("for", name);
    label.setAttribute("title", tooltip);
    label.innerText = name;
    const input = document.createElement("input");
    input.setAttribute("id", name);
    input.setAttribute("type", "checkbox");
    input.checked = simulationParameters[configKey];

    const tableRow = document.createElement("tr");
    tableRow.append(
        document.createElement("td").appendChild(label).parentElement,
        document.createElement("td").appendChild(input).parentElement,
    );
    configTable.appendChild(tableRow);

    const onUpdate = () => {
        simulationParameters[configKey] = input.checked;
    };
    onUpdate();
    input.addEventListener("input", onUpdate);
    controls.push({key: configKey, updater: (value: boolean) => {
        input.checked = value;
    }});
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