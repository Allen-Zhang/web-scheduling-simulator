// P-EDF algorithm
function P_EDF(){
	for(var i=0; i < 30; i++){
		for(var j in simulator.resourceList){
			var resource = simulator.resourceList[j];

			//check deadline miss event
			checkMissEvent(i,resource);

			//check process finish event
			checkAndHandleFinishProcess(i,resource);

			//check arrival process
			checkAndHandleArrivalProcess(i,resource);	
			if(resource.status == 0)
				executionProcess(i,resource);
		}
	}
}
