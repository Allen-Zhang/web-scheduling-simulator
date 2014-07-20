// G_EDF algorithm
function G_EDF(){
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

		//check and handle interrupt event
		for(var j in simulator.resourceList){
			var resource = simulator.resourceList[j];
			if(resource.status != 1){
				executionProcess(i,resource);
			}
		}
		
	}
}