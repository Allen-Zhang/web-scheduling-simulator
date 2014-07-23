// G_EDF algorithm
function G_EDF(){
	
	updateIdleCPUListAndLeastPriorityProcess();

	for(var i=0; i < 50; i++){
		//check deadline miss event
		checkMissEvent(i);
		for(var j in simulator.resourceList){
			var resource = simulator.resourceList[j];
			//check process finish event
			checkAndHandleFinishProcess(i,resource);		
		}	
		//check arrival process
		checkAndHandleArrivalProcess(i,resource);

		while(1){
			if(simulator.idleCPUList.length == 0||simulator.globalReadyQueue.length == 0)
				break;
			executionProcess(i,simulator.idleCPUList[0]);	//idleCPUList is sorted by cpu utilization dynamically
		}
	}
}