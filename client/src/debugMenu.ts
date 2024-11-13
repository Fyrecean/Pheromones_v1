export interface IDebugMetric {
    name: string,
    getter: () => string,
}
export const debugMetrics: IDebugMetric[]  = [];

interface MetricRefresher {
    cell: HTMLTableCellElement,
    metric: IDebugMetric,
}
const debugMetricDisplays: MetricRefresher[] = [];

let showDebug = true;
export function initalizeDebug() {
    const showDebugButton = document.getElementById("showDebug");
    const debugPanel = document.getElementById("debugFlyout");
    showDebugButton.onclick = () => {
        showDebug = !showDebug;
        if (showDebug) {
            showDebugButton.innerText = "Hide Debug Info";
            debugPanel.style.display = "";
        } else {
            showDebugButton.innerText = "Show Debug Info";
            debugPanel.hidden = true;
            debugPanel.style.display = "none";
        }
    }

    const debugTable = document.getElementById("debugInfoTable");
    debugTable.innerHTML = null;  
    debugMetrics.forEach(metric => {
    const row = document.createElement("tr");
        row.appendChild(document.createElement("td")).innerText = metric.name;
        const dataCell = document.createElement("td");
        row.appendChild(dataCell);
        debugTable.appendChild(row);
        debugMetricDisplays.push({ cell: dataCell, metric });
    });
}

export function refreshDebug() {
    debugMetricDisplays.forEach(metric => {
        metric.cell.innerText = metric.metric.getter();
    });
}