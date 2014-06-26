
function CPU(cid, executedAlgorithm) {
	
	this.cid = cid;
	this.name = "CPU" + this.cid;
	this.status = "";
	this.executedAlgorithm = executedAlgorithm !== undefined ? executedAlgorithm : "";  // algorithm that executed on the cpu
}

function CPUManager() {
    this.CPUList = [];

    this.addCPU = function (cpu) {
        this.CPUList[this.CPUList.length] = cpu;
	}

	this.getNextID = function() {
		var index = this.CPUList.length
		return index;  // Using index as cid
	}
}