
var colors = new Array("#2ecc71","#f1c40f","#3498db","#e74c3c","#e67e22","#9b59b6","#ecf0f1","#7f8c8d","#f39c12","#1abc9c");

function Process(pid, arrivalTime, execTime, period, executedCPU) {
	
	this.pid = pid;
	this.name = "P" + this.pid;
	this.priority = "";
	this.status = "";
	this.active = true;  // If a process is deleted by user, change it to false
	this.firstArrivalTime = arrivalTime !== undefined ? arrivalTime : 0;
	this.arrivalTime = arrivalTime !== undefined ? arrivalTime : 0;
	this.period = period !== undefined ? period : 0;
	this.execTime = execTime !== undefined ? execTime : 0;
	this.executedCPU = executedCPU !== undefined ? executedCPU : 0;
	this.showColor = colors[pid%10];
	this.startTime = -1;
	this.remainingTime = this.execTime;
	this.deadline = parseInt(this.arrivalTime) + parseInt(this.period);	//first deadline

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

