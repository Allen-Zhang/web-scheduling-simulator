
function CPU(processList) {
	
	this.cid = "";
	this.name = "";
	this.status = "";
	this.processList = processList !== undefined ? processList : [];
}

function CPUManager() {
    this.CPUList = [];

    this.addCPU = function (cpu) {
        CPUList[CPUList.length] = cpu;

	}
}