
function Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueue, readyQueueDeadlines, runningProcessDeadline) {
	this.pid = pid !== undefined ? pid : "";
	this.cid = cid !== undefined ? cid : "";  // Event happend on which CPU
	this.eventType = eventType !== undefined ? eventType : "";  // arrival, interrupt, missing, restart, execution
	this.eventStartTime = eventStartTime !== undefined ? eventStartTime : "";
	this.eventEndTime = eventEndTime !== undefined ? eventEndTime : eventStartTime;  // For execution event
	this.readyQueue = readyQueue !== undefined ? readyQueue : [];
	this.readyQueueDeadlines = readyQueueDeadlines !== undefined ? readyQueueDeadlines : [];
	this.runningProcessDeadline = runningProcessDeadline !== undefined ? runningProcessDeadline: "";
	this.checked = 0;
}

function RecorderManager() {
    this.recorderList = [];
    this.index = -1;
    this.recorderSequence = [];
    this.previousExecutionEvent = [];

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
	
	//this.testCase();
	
	this.recordNewEvent = function(pid, cid, eventType, eventStartTime, eventEndTime, readyQueue, runningProcessDeadline){
		var readyQueueList = [];
		var readyqueueDeadlines = [];
		for(var i in readyQueue){
			readyQueueList[i] = readyQueue[i].pid;
			readyqueueDeadlines[i] = readyQueue[i].deadline;
		}

		var deadline = "";
		if(eventType == "execution")
			deadline = runningProcessDeadline;
		
		var record = new Recorder(pid, cid, eventType, eventStartTime, eventEndTime, readyQueueList, readyqueueDeadlines, deadline);
		this.addRecorder(record);
		// var text="";
		// 	for(var t in readyQueueList){
		// 	 	text+=readyQueueList[t]+"|";}
		// 	 alert(text);
	}

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
			if(recorder.eventType == nextRecorder.eventType && nextRecorder.eventStartTime== recorder.eventStartTime){
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


		// var index = 0;
		// var pointer = 0;

		// for(var i=0; i<this.recorderList.length;i++){
		// 	if(this.recorderList[i].checked == 0){
		// 		var recorder = this.recorderList[i];
		// 		var type = recorder.eventType;
		// 		var startT = recorder.eventStartTime;
		// 		this.recorderSequence[index] = [];
		// 		pointer = 0;
		// 		this.recorderSequence[index][pointer] = i;

		// 		for(var j=i+1;j<this.recorderList.length;j++){
		// 			var nextRecorder = this.recorderList[j];
		// 			var nextStartT = nextRecorder.eventStartTime;
		// 			var nextType = nextRecorder.eventType;
		// 			var checked = nextRecorder.checked;

		// 			if(nextStartT != startT){
		// 				break;
		// 			}
		// 			if(nextType == type && checked == 0){
		// 				pointer++;
		// 				this.recorderSequence[index][pointer] = j;
		// 				this.recorderList[j].checked = 1;
		// 			}
		// 		}
		// 		index++;
		// 	}	
		// }
	}

}



