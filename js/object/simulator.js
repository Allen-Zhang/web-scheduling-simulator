
function Simulator(scheme, algorithm, resourceList, processList) {
	
	this.scheme = scheme !== undefined ? scheme : "";
	this.algorithm = algorithm !== undefined ? algorithm : ""; 
	this.resourceList = resourceList !== undefined ? resourceList : [];
	this.processList = processList !== undefined ? processList : [];

	this.startSimulator = function() {
		switch(this.scheme){
			case "partitioned":
				partitioningStrategy();
				switch(this.algorithm){
					case "P-EDF":
						break;
				}
				break;
			case "global": 
				break;
		}
	}

}


