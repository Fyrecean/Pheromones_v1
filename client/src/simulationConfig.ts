export interface ISimulationParameters {
    agentCount: number
    width: number,
    height: number,
}

export function getAgentsArray(parameters: ISimulationParameters): number[] {
    const agentsArray = new Array(4 * parameters.agentCount);
    for (let i = 0; i < parameters.agentCount; i += 4) {
        agentsArray[i] = 128;
        agentsArray[i+1] = 256;
        agentsArray[i+2] = Math.random() - .5;
        agentsArray[i+3] = Math.random() - .5;
    }
    return agentsArray;
}