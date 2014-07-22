// G_EDF algorithm
function G_EDF(){
	
	updateIdleCPUListAndLeastPriorityProcess();
	// var text="";
	// 		for(var i in simulator.idleCPUList){
	// 			text+=simulator.idleCPUList[i].cid;
	// 		}
	// 		alert(text);
	for(var i=0; i < 30; i++){

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
			executionProcess(i,simulator.idleCPUList[0]);	//idlelist is sorted by cpu utilization dynamically
			//alert("2");
		}
		// for(var j in simulator.idleCPUList)
		// 	executionProcess(i,simulator.idleCPUList[0]);//idlelist is sorted by cpu utilization dynamically

	}
}