
function CPU(executedAlgorithm) {
	
	this.cid = "";
	this.name = "";
	this.status = "";
	this.executedAlgorithm = executedAlgorithm !== undefined ? executedAlgorithm : "";  // algorithm that executed on the cpu
}

function CPUManager() {
    this.CPUList = [];

    this.addCPU = function (cpu) {
        this.CPUList[this.CPUList.length] = cpu;
	}
}