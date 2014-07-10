/*
 * For partitioned scheme
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
		// utilization = execution time / period
		rList[targetRListIndex].remainingUtil = targetReUtil - pList[i].execTime / pList[i].period;

	}

}
