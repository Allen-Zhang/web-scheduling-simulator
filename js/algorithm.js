/*
 * Current process is allocated to the CPU 
 * whose remaining utilization is the largest
 */
function partitioningStrategy() {

	var pList = simulator.processList;
	var rList = simulator.resourceList;

	for (var i in pList) {

		// Find the CPU whose remaining utilization is the largest
		var targetCid = rList[0].cid;
		var targetReUtil = rList[0].remainingUtil;
		var targetRListIndex = 0;

		for (var j = 0; j < rList.length - 1; j++) {
			if (targetReUtil < rList[j+1].remainingUtil) {
				targetReUtil = rList[j+1].remainingUtil;
				targetCid = rList[j+1].cid;
				targetRListIndex = j + 1;
			}
		}

		// Allocate current process to the target CPU
		pList[i].executedCPU = targetCid;

		// Update this target CPU's remaining utilization
		rList[targetRListIndex].remainingUtil = targetReUtil - pList[i].execTime / pList[i].period;

	}

}

// P-EDF algorithm
function P_EDF(){
	for(var i=0; i<20; i++){
		for(var j in simulator.resourceList){
			var resource = simulator.resourceList[j];
			//check arrival process
			var arrivalP = checkArrivalProcess(i, j);
					
			if(arrivalP){
				//updata ready queue
				handleArrvialEvent(arrivalP,resource);
				// //handle interrupt
				// if(resource.status == 1 && resource.runningProcess.deadline > readyQueue[0].deadline){
				// 	handleInterrupt();
				// }
				if(resource.status == 0){
					executionProcess(resource,i);
				}
			}

			var finishP = checkFinishProcess(resource,i);
			if(finishP){
				handFinishEvent(finishP,resource);
			}
			if(resource.status == 0){
				executionProcess(resource,i);
			}
			//if so
			//sort ready queue
			//else if(CPU is idle)
			//pop the first process in ready queue
			//exec 
			//update Q
		}
	}
}

function checkArrivalProcess(time, cid){
	var pList = simulator.processList;
	var arrivalProcesses = [];
	for(var i in pList){
		if(pList[i].arrivalTime == time && pList[i].executedCPU == cid){
			arrivalProcesses.push(pList[i]);
		}
	}

	if(arrivalProcesses.length == 0)
		return 0;
	else
		return arrivalProcesses;
}

function handleArrvialEvent(arrivalP,resource){
	var readyQueue = resource.readyQueue;

	for(var k in arrivalP){
		var flag = 0;
		for(var t in readyQueue){
			if(arrivalP[k].deadline < readyQueue[t].deadline){ // if arrival preocee deadline is equal with other, put it first place
				flag = 1;
				break;
			}
		}
		if(flag == 1){
			readyQueue.unshift(arrivalP[k]);
		}
		else{
			readyQueue.push(arrivalP[k]);
		}
		var text="";
			// for(var t in readyQueue){
			//  	text+=readyQueue[t].pid+"|";}
			//  alert(text);
	}
			

}
function executionProcess(resource, time){
	if(resource.readyQueue.length!=0){
		var execP = resource.readyQueue.shift();
		execP.startTime = time;
		simulator.finishEventList.push(execP);
		resource.status = 1;
		execP.arrivalTime = execP.deadline;
		alert("time:"+time+"cid:"+resource.cid+"pid"+execP.pid);
		var text="";
			for(var t in resource.readyQueue){
			 	text+=resource.readyQueue[t].pid+"|";}
			 alert(text);
	}
}

function checkFinishProcess(resource, time){
	var finishList = simulator.finishEventList;
	for(var i in finishList){
		if(((parseInt(finishList[i].startTime)+parseInt(finishList[i].execTime)) == time) && (resource.cid == finishList[i].executedCPU)){
			return finishList[i];
		}
	}
	return 0;
}

function handFinishEvent(process,resource){
	process.deadline = parseInt(process.deadline) + parseInt(process.period);
	resource.status = 0;
}