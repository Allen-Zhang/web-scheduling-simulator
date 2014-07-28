/*
 * Function for P-RMS algorithm
 */ 
function P_RMS(){
	//simulate 0~50 time unit
	for(var i=0; i < 50; i++){
		for(var j in simulator.resourceList){
			var resource = simulator.resourceList[j];

			//check deadline miss event and record
			checkMissEvent(i,resource);

			//check process finish event and handle it
			checkAndHandleFinishProcess(i,resource);

			//check arrival process and handle it 
			checkAndHandleArrivalProcess(i,resource);	

			//if this cpu is still idle, allocate this cpu to the first process in the global ready queue
			if(resource.status == 0)
				executionProcess(i,resource);
		}
	}
}
