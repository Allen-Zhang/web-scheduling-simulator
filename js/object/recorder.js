
function Recorder(pid, cid, eventType, eventStartTime, eventEndTime) {
	this.pid = pid !== undefined ? pid : "";
	this.cid = cid !== undefined ? cid : "";  // Event happend on which CPU
	this.eventType = eventType !== undefined ? eventType : "";  // arrival, interrupt, missing, restart, execution
	this.eventStartTime = eventStartTime !== undefined ? eventStartTime : "";
	this.eventEndTime = eventEndTime !== undefined ? eventEndTime : eventStartTime;  // For execution event	
}

function RecorderManager() {
    this.recorderList = [];
    this.index = -1;

    this.addRecorder = function(recorder) {
        this.recorderList[this.recorderList.length] = recorder;
	}

	this.getNextEventIndex = function() {
		return ++this.index;
	}

	this.testCase = function() {

		this.addRecorder(new Recorder(0, 0, "arrival", 0));
		this.addRecorder(new Recorder(1, 0, "execution", 0, 5));
		this.addRecorder(new Recorder(1, 0, "arrival", 1));
		this.addRecorder(new Recorder(2, 1, "arrival", 1));
		this.addRecorder(new Recorder(3, 1, "arrival", 1));
		this.addRecorder(new Recorder(4, 1, "arrival", 1));
		this.addRecorder(new Recorder(4, 2, "execution", 3, 10));
		
		
		this.addRecorder(new Recorder(3, 1, "execution", 5, 10));
		
		this.addRecorder(new Recorder(5, 0, "execution", 11, 13));
		this.addRecorder(new Recorder(3, 2, "execution", 18, 25));

	}
	
	this.testCase();
	

}



