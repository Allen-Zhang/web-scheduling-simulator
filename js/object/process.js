
var colors = new Array("#2ecc71","#3498db","#9b59b6","#f1c40f","#e67e22","#e74c3c","#ecf0f1","#7f8c8d","#f39c12","#1abc9c")

function Process(pid, arrivalTime, execTime, period, executedCPU) {
	
	this.pid = pid;
	this.name = "P" + this.pid;
	this.priority = "";
	this.status = "";
	this.active = true;  // If a process is deleted by user, change it to false

	this.arrivalTime = arrivalTime !== undefined ? arrivalTime : "";
	this.period = period !== undefined ? period : "";
	this.execTime = execTime !== undefined ? execTime : "";
	this.executedCPU = executedCPU !== undefined ? executedCPU : "";
	this.showColor = colors[pid%10];
	// this.startTime = "";
	// this.remainingTime = "";
	// this.deadline = "";
	// function getRandomColor(){
 	//  	return '#'+Math.floor(Math.random()*16777215).toString(16); 
	// }
	

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

