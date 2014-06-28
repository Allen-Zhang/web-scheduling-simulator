
function Recorder(pid, cid, eventType, timePoint, eventDuartion) {
	this.rcdrPid = pid !== undefined ? pid : "";
	this.rcdrCid = cid !== undefined ? cid : "";  // Event happend on which CPU
	this.eventType = eventType !== undefined ? eventType : "";  // arrive, interrupt, missing, restart, execute
	this.timePoint = timePoint !== undefined ? timePoint : "";
	this.eventDuartion = eventDuartion !== undefined ? eventDuartion : "";  // For execution event	
}