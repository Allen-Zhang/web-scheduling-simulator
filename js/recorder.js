
function Recorder(processObj, readyQueueArray, processStatusFlag) {
	
	this.processObj = processObj !== undefined ? processObj : "";
	this.readyQueueArray = readyQueueArray !== undefined ? readyQueueArray : [];
	this.processStatusFlag = processStatusFlag !== undefined ? processStatusFlag : "";  // missing, complete, interrupted

	this.step = [processObj, readyQueueArray, statusFlag];

}


$()