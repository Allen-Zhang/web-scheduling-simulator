
function Process(arrivalTime, execTime, period, executedCPU) {
	
	this.pid = "";
	this.name = "";
	this.priority = "";
	this.status = "";

	this.arrivalTime = arrivalTime !== undefined ? arrivalTime : "";
	this.period = period !== undefined ? period : "";
	this.execTime = execTime !== undefined ? execTime : "";
	this.executedCPU = executedCPU !== undefined ? executedCPU : "";

	this.startTime = "";
	this.remainingTime = "";
	this.deadline = "";


}


function ProcessManager() {
    this.processList = [];

    this.addProcess = function(process) {
        processList[processList.length] = process;
	}
}