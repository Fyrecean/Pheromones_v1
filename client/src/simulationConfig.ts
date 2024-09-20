export interface ISimulationParameters {
    agentCount: number
    width: number,
    height: number,
    turnJitter: number,
    steerFactor: number,
    sampleDistance: number,
    passiveAttenuation: number,
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