
function Process(pid, arrivalTime, execTime, period, executedCPU) {
	
	this.pid = pid;
	this.name = "P" + this.pid;
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
        this.processList[this.processList.length] = process;
	}

	this.getNextID = function() {
		var index = this.processList.length
		return index;  // Using index as pid
	}

	this.resetProcessList = function() {
		this.processList.length = 0;
	}
}

