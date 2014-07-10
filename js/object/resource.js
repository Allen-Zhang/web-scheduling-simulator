
function CPU(cid) {
	
	this.cid = cid;
	this.name = "CPU" + this.cid;
	this.status = "";
	this.remainingUtil = 1;  // Remaining utilization
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

	this.resetCPUList = function() {
		this.CPUList.length = 0;
	}
	
}