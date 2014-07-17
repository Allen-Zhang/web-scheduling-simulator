// P-EDF algorithm
function P_EDF(){
	for(var i=0; i < 30; i++){
		for(var j in simulator.resourceList){
			var resource = simulator.resourceList[j];

			//check deadline miss event
			checkMissEvent(resource,i);

			//check process finish event
			var finishP = checkFinishProcess(resource,i);
			if(finishP){
				handleFinishEvent(finishP,resource);
			}


			//check arrival process
			var arrivalP = checkArrivalProcess(i, resource);
					
			if(arrivalP){
				//updata ready queue
				handleArrvialEvent(arrivalP,resource,0);
				//handle interrupt
				if(resource.runningProcess.deadline > resource.readyQueue[0].deadline){
					 handleInterrupt(resource,i);
				}
			}

			if(resource.status == 0){
				executionProcess(resource,i);
			}
		}
	}
}

function checkArrivalProcess(time, resource){
	var pList = simulator.processList;
	var arrivalProcesses = [];
	for(var i in pList){
		
		if((pList[i].arrivalTime == time ) && (pList[i].executedCPU == resource.cid)){
			var newP = new Process(pList[i].pid, pList[i].arrivalTime, pList[i].execTime, pList[i].period, pList[i].executedCPU);
			arrivalProcesses.push(newP);
			pList[i].arrivalTime = pList[i].deadline;
			pList[i].deadline = parseInt(pList[i].deadline) + parseInt(pList[i].period);		
		}
	}

	if(arrivalProcesses.length == 0)
		return 0;
	else
		return arrivalProcesses;
}
//flag=1 represent interrupt arrival event
function handleArrvialEvent(arrivalP,resource,flag){

	var readyQueue = resource.readyQueue;
	for(var k in arrivalP){

		var newP = new Process(arrivalP[k].pid, arrivalP[k].arrivalTime, arrivalP[k].execTime, arrivalP[k].period, arrivalP[k].executedCPU);
		readyQueue.push(newP);
		//alert(arrivalP[k].period);
		for(var t = readyQueue.length-2;t>=0;t--){
			if(arrivalP[k].deadline < readyQueue[t].deadline){ // if arrival preocee deadline is equal with other, put it first place
				var temp = readyQueue[t];
				readyQueue[t]=newP;
				readyQueue[t+1]=temp;
			}
		}
			// var text="";
			// for(var t in readyQueue){
			//  	text+=readyQueue[t].pid+"*"+readyQueue[t].deadline+"|";}
			//  alert(text);
		//record new arrvial event
		if(flag == 0)
			recorder_manager.recordNewEvent(newP.pid,resource.cid,"arrival",newP.arrivalTime,newP.arrivalTime,resource.readyQueue);
		// if(flag == 1){
		// 	var recorder = new Recorder(newP.pid,resource.cid,"arrival",newP.arrivalTime,newP.arrivalTime,resource.readyQueue);
		// 	modifyCurrentRecorder(recorder);
		// }
	}
			

}
function executionProcess(resource, time){
	if(resource.readyQueue.length!=0){
		var execP = resource.readyQueue.shift();
		execP.startTime = time;
		//execP.arrivalTime = execP.deadline;
		
		simulator.finishEventList.push(execP);		

		resource.status = 1;
		resource.runningProcess = execP;
		//record new execution event
		recorder_manager.recordNewEvent(execP.pid,resource.cid,"execution",time,parseInt(execP.remainingTime)+parseInt(execP.startTime),resource.readyQueue, execP.deadline);
		// alert("time:"+time+"cid:"+resource.cid+"pid"+execP.pid);
		// alert("#"+execP.arrivalTime);
		// var text="";
		// 	for(var t in resource.readyQueue){
		// 	 	text+=resource.readyQueue[t].pid+"|";}
		// 	 alert(text);
	}
}

function checkFinishProcess(resource, time){

	var finishList = simulator.finishEventList;
	for(var i in finishList){
		if( parseInt(finishList[i].startTime)+parseInt(finishList[i].execTime) == time && resource.cid == finishList[i].executedCPU){
			return finishList[i];
		}
	}
	return 0;
}

function handleFinishEvent(process,resource){
	resource.status = 0;
	resource.runningProcess="";
	deleteFinishEvent(process.pid);
}

function handleInterrupt(resource, time){
	var interP = [];
	interP.push(resource.runningProcess);
	interP[0].execTime = interP[0].execTime-(time - interP[0].startTime);

	//put it into ready queue
	handleArrvialEvent(interP,resource,1);
	//delete interrupt previous finish event
	deleteFinishEvent(interP[0].pid);

	//update cpu
	resource.status = 0;
	resource.runningProcess = "";
	
	//modify currnet execution event
	//var recorder = new Recorder(interP[0].pid, interP[0].executedCPU,"execution", interP[0].startTime, time, readyQueueList, deadlines, interP[0].deadline);
	modifyRecorderEndTime(interP[0].pid, interP[0].executedCPU, interP[0].startTime, "execution", time );

	//modify currnet arrival event
	// recorder = new Recorder(resource.readyQueue[0].pid, resource.cid,"interrupt", time,time, readyQueueList, deadlines);
	var readyQueueList = [];
	var deadlines = [];
	for(var i in resource.readyQueue){
		readyQueueList[i] = resource.readyQueue[i].pid;
		deadlines[i] = resource.readyQueue[i].deadline;
	}
	modifyRecorderTypeAndReadyqueue(resource.readyQueue[0].pid, resource.cid, time, "arrival", "interrupt", readyQueueList, deadlines);

	//execute interrupt process
	executionProcess(resource,time);
}

function deleteFinishEvent(pid){
	for(var i in simulator.finishEventList){
		if(simulator.finishEventList[i].pid == pid)
			simulator.finishEventList.splice(i,1);
	}
}

function checkMissEvent(resource,time){
	var process = resource.runningProcess;
	if((parseInt(process.startTime)+parseInt(process.execTime)) > process.deadline && process.deadline == time)
		recorder_manager.recordNewEvent(process.pid,resource.cid,"miss",time,time,resource.readyQueue);

	var readyQueue = resource.readyQueue;
	for(var i in readyQueue){
		if(time == readyQueue[i].deadline){
			//alert(time+"|"+readyQueue[i].pid);
			recorder_manager.recordNewEvent(readyQueue[i].pid,resource.cid,"miss",time,time,resource.readyQueue);
		}
	}
}

function modifyRecorderTypeAndReadyqueue(pid,cid,startTime,oldType,newType,readyQueue,deadlines){
	for(var i=recorder_manager.recorderList.length-1;i>=0;i--){
		var temp = recorder_manager.recorderList[i];
		if(cid == temp.cid && startTime == temp.eventStartTime && pid == temp.pid && oldType == temp.eventType){
			recorder_manager.recorderList[i].eventType = newType;
			recorder_manager.recorderList[i].readyQueue = readyQueue;
			recorder_manager.recorderList[i].readyQueueDeadlines = deadlines;
			break;
		}
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