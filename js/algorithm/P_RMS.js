function P_RMS(){
	for(var i=0; i < 30; i++){
		for(var j in simulator.resourceList){
			var resource = simulator.resourceList[j];

			//check deadline miss event
			checkMissEvent(resource,i);

			//check process finish event
			checkAndHandleFinishProcess(resource,i);

			//check arrival process
			checkAndHandleArrivalProcess(i, resource);	
			if(resource.status == 0)
				executionProcess(resource,i);
		}
	}
}