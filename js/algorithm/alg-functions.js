
function checkAndHandleArrivalProcess(time, resource){

	var algorithm = simulator.algorithm;
	switch(algorithm){
		case "P-EDF":
			var pList = simulator.processList;
			var interruptOccur = 0;
			var deadline = resource.runningProcess.deadline;

			for(var i in pList){		
				if((pList[i].arrivalTime == time ) && (pList[i].executedCPU == resource.cid)){
					var newP = new Process(pList[i].pid, pList[i].arrivalTime, pList[i].execTime, pList[i].period, pList[i].executedCPU);
					pList[i].arrivalTime = pList[i].deadline;
					pList[i].deadline = parseInt(pList[i].deadline) + parseInt(pList[i].period);	
					handleArrvialEvent(newP,resource);
					if(deadline > newP.deadline){
						handleInterrupt(time, resource);
						recorder_manager.recordNewEvent(newP.pid,resource.cid,"interrupt",newP.arrivalTime,newP.arrivalTime,resource.readyQueue,"");
						deadline = newP.deadline;
						interruptOccur = 1; 			
					}
					else
						recorder_manager.recordNewEvent(newP.pid,resource.cid,"arrival",newP.arrivalTime,newP.arrivalTime,resource.readyQueue,resource.runningProcess);
				}
			}
			if(interruptOccur == 1){	
				executionProcess(time, resource);
			}
			break;
		case "P-RMS":
			var pList = simulator.processList;
			var interruptOccur = 0;
			var period = resource.runningProcess.period;

			for(var i in pList){		
				if((pList[i].arrivalTime == time ) && (pList[i].executedCPU == resource.cid)){
					var newP = new Process(pList[i].pid, pList[i].arrivalTime, pList[i].execTime, pList[i].period, pList[i].executedCPU);
					pList[i].arrivalTime = pList[i].deadline;
					pList[i].deadline = parseInt(pList[i].deadline) + parseInt(pList[i].period);	
					handleArrvialEvent(newP,resource);
					if(period > newP.period){
						handleInterrupt(time,resource);
						recorder_manager.recordNewEvent(newP.pid,resource.cid,"interrupt",newP.arrivalTime,newP.arrivalTime,resource.readyQueue,"");
						period = newP.period;
						interruptOccur = 1; 			
					}
					else
						recorder_manager.recordNewEvent(newP.pid,resource.cid,"arrival",newP.arrivalTime,newP.arrivalTime,resource.readyQueue,resource.runningProcess);
				}
			}
			if(interruptOccur == 1){	
				executionProcess(time,resource);
			}
			break;
		case "G-EDF":
			var pList = simulator.processList;
			for(var i in pList){		
				if(pList[i].arrivalTime == time){
					var newP = new Process(pList[i].pid, pList[i].arrivalTime, pList[i].execTime, pList[i].period, "");
					pList[i].arrivalTime = pList[i].deadline;
					pList[i].deadline = parseInt(pList[i].deadline) + parseInt(pList[i].period);	
					handleArrvialEvent(newP);
					recorder_manager.recordNewEvent(newP.pid,-1,"arrival",newP.arrivalTime,newP.arrivalTime,simulator.globalReadyQueue,"");
				}
			}
			break;
	}	
}

function handleArrvialEvent(arrivalP,resource){

	var algorithm = simulator.algorithm;
	switch(algorithm){
		case "P-EDF":
			var readyQueue = resource.readyQueue;
			readyQueue.push(arrivalP);
			for(var t = readyQueue.length-2;t>=0;t--){
				if(arrivalP.deadline < readyQueue[t].deadline){ // if arrival preocee deadline is equal with other, put it first place
					var temp = readyQueue[t];
					readyQueue[t]=arrivalP;
					readyQueue[t+1]=temp;
				}
			}
			break;
		case "P-RMS":
			var readyQueue = resource.readyQueue;
			readyQueue.push(arrivalP);
			for(var t = readyQueue.length-2;t>=0;t--){
				if(arrivalP.period < readyQueue[t].period){ // if arrival preocee deadline is equal with other, put it first place
					var temp = readyQueue[t];
					readyQueue[t]=arrivalP;
					readyQueue[t+1]=temp;
				}
			}
			break;
		case "G-EDF":
			var readyQueue = simulator.globalReadyQueue;
			readyQueue.push(arrivalP);
			for(var t = readyQueue.length-2;t>=0;t--){
				if(arrivalP.deadline < readyQueue[t].deadline){ // if arrival preocee deadline is equal with other, put it first place
					var temp = readyQueue[t];
					readyQueue[t]=arrivalP;
					readyQueue[t+1]=temp;
				}
			}
			break;
	}
}

function executionProcess(time,resource){
	var scheme = simulator.scheme;
	switch(scheme){
		case "partitioned":
			if(resource.readyQueue.length!=0){
				var execP = resource.readyQueue.shift();
				execP.startTime = time;	
				simulator.finishEventList.push(execP);		

				resource.status = 1;
				resource.runningProcess = execP;
				//record new execution event
				recorder_manager.recordNewEvent(execP.pid,resource.cid,"execution",time,parseInt(execP.execTime)+parseInt(execP.startTime),resource.readyQueue, resource.runningProcess);
			}
			break;
		case "global":
			if(simulator.globalReadyQueue.length!=0){
				var execP = simulator.globalReadyQueue.shift();
				execP.startTime = time;
				execP.executedCPU = resource.cid;
				simulator.finishEventList.push(execP);		
				//alert(resource.cid+"|"+time+"|"+resource.status);
				resource.status = 1;
				resource.runningProcess = execP;
				//record new execution event
				recorder_manager.recordNewEvent(execP.pid,resource.cid,"execution",time,parseInt(execP.execTime)+parseInt(execP.startTime),simulator.globalReadyQueue, execP);
				
			}
			break;
	}
}

function checkAndHandleFinishProcess(time,resource){

	var finishList = simulator.finishEventList;
	for(var i in finishList){
		if( parseInt(finishList[i].startTime)+parseInt(finishList[i].execTime) == time && resource.cid == finishList[i].executedCPU){
			handleFinishEvent(finishList[i],resource);
			//alert(time+"|"+resource.cid);
		}
	}
}

function handleFinishEvent(process,resource){
	resource.status = 0;
	resource.runningProcess = "";	
	deleteFinishEvent(process.pid);
	if(simulator.scheme == "global"){
		resource.remainingUtil -= process.execTime/process.period;
	}
}

function handleInterrupt(time, resource){
	if(resource.runningProcess){
		var interP = resource.runningProcess;
		interP.execTime = interP.execTime-(time - interP.startTime);

		//put it into ready queue
		handleArrvialEvent(interP,resource);
		//delete interrupt previous finish event
		deleteFinishEvent(interP.pid);

		//update cpu
		resource.status = 0;
		resource.runningProcess = "";

		//modify interrupted process execution recorder
		modifyRecorderEndTime(interP.pid, interP.executedCPU, interP.startTime, "execution", time );
	}	
}

function deleteFinishEvent(pid){
	for(var i in simulator.finishEventList){
		if(simulator.finishEventList[i].pid == pid)
			simulator.finishEventList.splice(i,1);
	}
}

function checkMissEvent(time, resource){
	var scheme = simulator.scheme;
	switch(scheme){
		case "partitioned":
			var process = resource.runningProcess;
			if((parseInt(process.startTime)+parseInt(process.execTime)) > process.deadline && process.deadline == time)
				recorder_manager.recordNewEvent(process.pid,resource.cid,"miss",time,time,resource.readyQueue,resource.runningProcess);

			var readyQueue = resource.readyQueue;
			for(var i in readyQueue){
				if(time == readyQueue[i].deadline){
					recorder_manager.recordNewEvent(readyQueue[i].pid,resource.cid,"miss",time,time,resource.readyQueue,resource.runningProcess);
				}
			}
			break;
		case "global":
			var process = simulator.globalRunningProcess;
			var readyQueue = simulator.globalReadyQueue;
			if((parseInt(process.startTime)+parseInt(process.execTime)) > process.deadline && process.deadline == time)
				recorder_manager.recordNewEvent(process.pid,-1,"miss",time,time,readyQueue,"");	
			for(var i in readyQueue){
				if(time == readyQueue[i].deadline){
					recorder_manager.recordNewEvent(readyQueue[i].pid,-1,"miss",time,time,readyQueue,"");
				}
			}
			break;
	}
}

function modifyRecorderEndTime(pid,cid,startTime,eventType,newEndTime){
	for(var i=recorder_manager.recorderList.length-1;i>=0;i--){
		var temp = recorder_manager.recorderList[i];
		if(cid == temp.cid && startTime == temp.eventStartTime && pid == temp.pid && eventType == temp.eventType){
			recorder_manager.recorderList[i].eventEndTime = newEndTime;
			break;
		}
	}
}