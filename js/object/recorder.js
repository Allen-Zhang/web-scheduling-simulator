/*
 * recorder object
 */
function Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueue, readyQueuePriority ,runningProcess, runningProcessPriority) {
	this.pid = pid !== undefined ? pid : "";  //which process
	this.cid = cid !== undefined ? cid : "";  // Event happend on which CPU
	this.eventType = eventType !== undefined ? eventType : "";  // arrival, interrupt, missing, restart, execution
	this.eventStartTime = eventStartTime !== undefined ? eventStartTime : "";
	this.eventEndTime = eventEndTime !== undefined ? eventEndTime : eventStartTime;  // For execution event
	this.readyQueue = readyQueue !== undefined ? readyQueue : [];	//the current readyqueue
	this.readyQueuePriority = readyQueuePriority !== undefined ? readyQueuePriority : [];
	this.runningProcess = runningProcess !== undefined ? runningProcess: "";	//current running process
	this.runningProcessPriority = runningProcessPriority !== undefined ? runningProcessPriority: "";
}
/*
 * record manager
 */
function RecorderManager() {
    this.recorderList = [];
    this.index = -1;
    this.recorderSequence = [];

    this.addRecorder = function(recorder) {
        this.recorderList[this.recorderList.length] = recorder;
	}

	this.getNextEventIndex = function() {
		if(this.index == this.recorderSequence.length-1)
			return -1;
		else
			return ++this.index;
	}
	this.getCurrentIndex = function(){
		return this.index;
	}

	this.gotoPreviousIndex = function(){
		if(this.index >=0)
			this.index--;
	}

	this.resetIndex =function(){
		this.index = -1;
	}
	//write new record
	this.recordNewEvent = function(pid, cid, eventType, eventStartTime, eventEndTime, readyQueue,runningProcess){
		var readyQueueList = [];
		var readyqueuePriority = [];
		var algorithm = simulator.algorithm;
		switch(algorithm){
			case "P-EDF":
				for(var i in readyQueue){
					readyQueueList[i] = readyQueue[i].pid;
					readyqueuePriority[i] = readyQueue[i].deadline;
				}
				if(runningProcess == "")
					var record = new Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueueList, readyqueuePriority, "","");
				else
					var record = new Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueueList, readyqueuePriority, runningProcess.pid,runningProcess.deadline);		
				break;
			case "P-RMS":
				for(var i in readyQueue){
					readyQueueList[i] = readyQueue[i].pid;
					readyqueuePriority[i] = readyQueue[i].period;
				}
				if(runningProcess == "")
					var record = new Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueueList, readyqueuePriority, "","");
				else
					var record = new Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueueList, readyqueuePriority, runningProcess.pid,runningProcess.period);		
				break;
			case "G-EDF":
				for(var i in readyQueue){
					readyQueueList[i] = readyQueue[i].pid;
					readyqueuePriority[i] = readyQueue[i].deadline;
				}
				if(runningProcess == "")
					var record = new Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueueList, readyqueuePriority, "","");
				else
					var record = new Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueueList, readyqueuePriority, runningProcess.pid,runningProcess.deadline);		
				break;
			case "G-RMS":
				for(var i in readyQueue){
					readyQueueList[i] = readyQueue[i].pid;
					readyqueuePriority[i] = readyQueue[i].period;
				}
				if(runningProcess == "")
					var record = new Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueueList, readyqueuePriority, "","");
				else
					var record = new Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueueList, readyqueuePriority, runningProcess.pid,runningProcess.period);		
				break;
		}
		this.addRecorder(record);
	}
	//handle the record sequence for rendering
	this.handleRecorderSequence = function(){
		//order arrival event before execution event
		for(var i=0; i<this.recorderList.length;i++){
			var recorder = this.recorderList[i];
			var startT = recorder.eventStartTime;
			if(recorder.eventType == "execution"){
				for(var j=i+1;j<this.recorderList.length;j++){
					var nextRecorder = this.recorderList[j];
					var nextStartT = nextRecorder.eventStartTime;
					var nextType = nextRecorder.eventType;

					if(nextStartT != startT){
						break;
					}
					if(nextType != "execution"){
						var temp = this.recorderList[j];
						this.recorderList[j] = this.recorderList[i];
						this.recorderList[i]= temp;
						i++;
					}
				}
			}
		}

		var index = 0;
		var pointer = 0;
		var recorder = this.recorderList[0];
		this.recorderSequence[index] = [];
		this.recorderSequence[index][pointer] = 0;

		for(var i=1; i<this.recorderList.length;i++){
			var nextRecorder = this.recorderList[i];

			if(nextRecorder.eventStartTime > simulator.totalRunningTime)
				break;
			if( recorder.eventType!="interrupt" && recorder.eventType == nextRecorder.eventType && nextRecorder.eventStartTime== recorder.eventStartTime){
				pointer++;
				this.recorderSequence[index][pointer] = i;
			}
			else{
				index++;
				this.recorderSequence[index] = [];
				pointer = 0;
				this.recorderSequence[index][pointer] = i;
				recorder = this.recorderList[i];
			}

		}
	}

}
