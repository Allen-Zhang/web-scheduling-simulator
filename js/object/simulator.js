
function Simulator(scheme, algorithm, resourceList, processList) {
	
	this.scheme = scheme !== undefined ? scheme : "";
	this.algorithm = algorithm !== undefined ? algorithm : "";
	this.resourceList = resourceList !== undefined ? resourceList : [];
	this.processList = processList !== undefined ? processList : [];

}