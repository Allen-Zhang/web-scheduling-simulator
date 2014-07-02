
function Recorder(pid, cid, eventType, eventStartTime, eventEndTime) {
	this.rcdrPid = pid !== undefined ? pid : "";
	this.rcdrCid = cid !== undefined ? cid : "";  // Event happend on which CPU
	this.eventType = eventType !== undefined ? eventType : "";  // arrival, interrupt, missing, restart, execution
	this.eventStartTime = eventStartTime !== undefined ? eventStartTime : "";
	this.eventEndTime = eventEndTime !== undefined ? eventEndTime : eventStartTime;  // For execution event	
}

function RecorderManager() {
    this.recorderList = [];

    this.addRecorder = function (recorder) {
        this.recorderList[this.recorderList.length] = recorder;
	}

	this.testCase = function() {

		this.addRecorder(new Recorder(0, 0, "arrival", 0));
		this.addRecorder(new Recorder(1, 0, "arrival", 1));
		this.addRecorder(new Recorder(2, 1, "arrival", 1));
		this.addRecorder(new Recorder(3, 1, "arrival", 2));
		this.addRecorder(new Recorder(4, 1, "arrival", 2));

		this.addRecorder(new Recorder(1, 0, "execution", 0, 5));
		this.addRecorder(new Recorder(2, 0, "execution", 5, 10));
		this.addRecorder(new Recorder(3, 0, "execution", 1, 10));
		this.addRecorder(new Recorder(4, 0, "execution", 10, 3));
		this.addRecorder(new Recorder(5, 0, "execution", 13, 5));

	}
	
	this.testCase();

}



