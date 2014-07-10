
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

	/* Calculate the hyperperiod begin */

	this.calculateHyperperiod = function() {
		var periodList = [];
		for (var i in this.processList) {
			periodList.push(this.processList[i].period);
		}
		return this.lcm_nums(periodList);
	}

	this.gcf = function(a, b) { 
		return (b == 0) ? (a) : (this.gcf(b, a % b)); 
	}
	
	this.lcm = function(a, b) { 
		return (a / this.gcf(a,b)) * b; 
	}

	// Calculate the least common multiple
	this.lcm_nums = function(ar) {
		if (ar.length > 1) {
			ar.push(this.lcm(ar.shift(), ar.shift()));
			return this.lcm_nums(ar);
		} else {
			return ar[0];
		}
	}

	/* Calculate the hyperperiod end */

	// Calculate the utilization for each resource
	this.calculateUtilization = function() {
		var utilList = [];
		for (var i in this.resourceList) {
			var remainingUtil = this.resourceList[i].remainingUtil
			if (remainingUtil < 0) 
				utilList.push(1);
			else 
				utilList.push(1 - remainingUtil);
		}
		return utilList;
	}

}
