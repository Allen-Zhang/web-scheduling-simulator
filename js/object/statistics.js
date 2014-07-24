function Statistics() {
	this.processArrivalTimes = [];
	this.CPUArrivalTimes = [];
	this.processRunningTime = [];
	this.CPURunningTime = [];
	this.processMissTimes = [];
	this.CPUMissTimes = [];

	this.processUtilization = [];
	this.processMissingRate =[];
	this.CPUUtilization = [];
	this.CPUMissingRate =[];
	this.averageUtilization = 0;
	this.averageMissingRate = 0;


	this.initialize = function(){
		this.averageUtilization = 0;
		this.averageMissingRate = 0;

		var CPUQty = simulator.resourceList.length;
		for(var i=0;i<CPUQty;i++ ){
			var cid = simulator.resourceList[i].cid;
			this.CPUArrivalTimes[cid] = 0;
			this.CPUMissTimes[cid] = 0;
			this.CPURunningTime[cid] = 0;
			this.CPUUtilization[cid] = 0;
			this.CPUMissingRate[cid] = 0;
		}

		var processQty = simulator.processList.length;
		for(var i=0;i<processQty;i++ ){
			var pid = simulator.processList[i].pid;
			this.processArrivalTimes[pid] = 0;
			this.processMissTimes[pid] = 0;
			this.processRunningTime[pid] = 0;
			this.processUtilization[pid] = 0;
			this.processMissingRate[pid] = 0;
		}
	}

	this.calculation = function(){

		for(var i in recorder_manager.recorderList){
			var recorder = recorder_manager.recorderList[i];
			if(recorder.eventType == "execution"){
				this.CPURunningTime[recorder.cid] += (recorder.eventEndTime - recorder.eventStartTime);
			}
		}

		var CPUQty = simulator.resourceList.length;
		var totalUtilization = 0;

		for(var i=0;i<CPUQty;i++){
			var cid = simulator.resourceList[i].cid;
			this.CPUUtilization[cid] = this.CPURunningTime[cid]/50;
			totalUtilization += this.CPUUtilization[cid];

		}
		this.averageUtilization = totalUtilization/CPUQty;

		var processQty = simulator.processList.length;
		for(var i=0;i<processQty;i++){
			var pid = simulator.processList[i].pid;
			this.processUtilization[pid] = simulator.processList[i].execTime/simulator.processList[i].period;
		}

	}

	// this.firstArrivalTime = arrivalTime;
	// this.arrivalTime = arrivalTime !== undefined ? arrivalTime : 0;
	// this.period = period !== undefined ? period : 1;
	// this.execTime = execTime !== undefined ? execTime : 0;
	// this.executedCPU = executedCPU !== undefined ? executedCPU : "Not Allocated";
	// this.showColor = colors[pid%10];
	// this.startTime = -1;
	// this.remainingTime = this.execTime;
	// this.deadline = parseInt(this.arrivalTime) + parseInt(this.period);	//first deadline

}