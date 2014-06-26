
function Simulator(scheme, resourceList, processList) {
	
	this.scheme = scheme !== undefined ? scheme : "";
	this.resourceList = resourceList !== undefined ? resourceList : [];
	this.processList = processList !== undefined ? processList : [];

}