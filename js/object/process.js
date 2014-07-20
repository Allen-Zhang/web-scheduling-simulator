
var colors = new Array("#2ecc71","#f1c40f","#3498db","#e74c3c","#e67e22","#9b59b6","#ecf0f1","#7f8c8d","#f39c12","#1abc9c");

function Process(pid, arrivalTime, execTime, period, executedCPU) {
	
	this.pid = pid;
	this.name = "P" + this.pid;
	this.priority = "";
	this.status = "";
	this.active = true;  // If a process is deleted by user, change it to false
	this.firstArrivalTime = arrivalTime;
	this.arrivalTime = arrivalTime !== undefined ? arrivalTime : 0;
	this.period = period !== undefined ? period : 1;
	this.execTime = execTime !== undefined ? execTime : 0;
	this.executedCPU = executedCPU !== undefined ? executedCPU : "Not Allocated";
	this.showColor = colors[pid%10];
	this.startTime = -1;
	this.remainingTime = this.execTime;
	this.deadline = parseInt(this.arrivalTime) + parseInt(this.period);	//first deadline

}


function ProcessManager() {

    this.processList = [];
    this.pid = -1;
    this.copyOfProcessList = [];

    this.addProcess = function(process) {
        this.processList[this.processList.length] = process;
	}

	this.getNextID = function() {
		//var index = this.processList.length
		return ++this.pid;  // Using index as pid
	}

	this.resetProcessList = function() {
		this.processList.length = 0;
	}

	this.drawProcessTable = function() {
		var rowCount= $("#process-quantity").val();
	    var table=$("<table id='process-table' border='0'></table>");
	   	table.appendTo($("#process-table-div"));

		var tr=$("<tr></tr>");
		tr.appendTo(table);
		var th=$("<th>Process Name</th>");
		th.appendTo(tr);
		var th=$("<th>Arrive Time</th>");
		th.appendTo(tr);
		var th=$("<th>Execution Time</th>");
		th.appendTo(tr);
		var th=$("<th>Period</th>");
		th.appendTo(tr);

		for(var i=0;i<rowCount;i++) {
			var tr=$("<tr></tr>");
			tr.appendTo(table);
			for(var j=0;j<4;j++) {
				var td=$("<td></td>");
				td.appendTo(tr);
				if(j == 0){
				  var text=$("<span>Process"+i+"</span>");
				  text.appendTo(td);
				} else if(j == 1){
					var input=$("<input id='input"+(i*4+j)+"' class='form-control p-unit'></input>");
					input.appendTo(td);
				} else if(j == 2){
					var input=$("<input id='input"+(i*4+j)+"' class='form-control p-unit p-exec"+i+"'></input>");
					input.appendTo(td);
				} else if(j == 3){
					var input=$("<input id='input"+(i*4+j)+"' class='form-control p-unit p-period"+i+"'></input>");
					input.appendTo(td);
				}
			}
		}
	}

	/*
	 * Function for adding a new process after 
	 * clicking Add Process button on modal4
	 */ 
	this.addNewEditProcess = function() {
		// Create a new process and push to processlist
		var index = process_manager.processList.length;
		var newPid = process_manager.getNextID();
		var newProcess = new Process(newPid);
		process_manager.processList.push(newProcess);
		var table = $('#edit-case-table');
		var newTr = $("<tr id='process"+index+"-row'></tr>");
		newTr.appendTo(table);
		for (var j = 0; j < 5; j++) {
			var td = $("<td></td>");
			td.appendTo(newTr);
			if (j == 0) {
			  var text = $("<span>Process"+newPid+"</span>");
			  text.appendTo(td);
			} else if (j == 1) {
				var input = $("<input id='edit-input"+(index*5+j)+"' class='form-control p-unit'></input>");
				input.appendTo(td);
			} else if (j == 2) {
				var input = $("<input id='edit-input"+(index*5+j)+"' class='form-control p-unit p-exec"+index+"'></input>");
				input.appendTo(td);
			} else if (j == 3) {
				var input = $("<input id='edit-input"+(index*5+j)+"' class='form-control p-unit p-period"+index+"'></input>");
				input.appendTo(td);
			} else if (j == 4) {
				  var text=$('<a href="#" class="delete-process" onclick="process_manager.deactivateProcess('+index+')">&times</a>');
				  text.appendTo(td);
			}
		}
	}

	/*
	 * Function for deactivate a exist process after clicking Delete button on modal4
	 */ 
	this.deactivateProcess = function(index) {
		var processes = process_manager.processList;
		// var processQty = processes.length;
		// for (var i =0; i < processQty; i++) {
		// 	if (processes[i].pid == pid) {
		// 		processes[i].active = false;
		// 		$("#process"+i+"-row").remove();
		// 	}
				
		// }
		$("#process"+index+"-row").remove();
		processes[index].active = false;
		//processes.splice(index,1);
	}

	/*
	 * Generate random parameters for processes
	 */
	this.randomizeProcess = function() {
		var rowCount= $("#process-quantity").val();
		for(var i = 0; i < rowCount; i++) {

			var arrivalTime = parseInt((Math.random() * 6));  // Randomize arrival time between 0 and 5	
			var period = parseInt((Math.random() * 10) + 1);  // Randomize arrival time between 1 and 10
			var execTime = parseInt((Math.random() * period) + 1);  // Randomize arrival time between 1 and period

			for(var j = 0; j < 4; j++) {
				if (j == 1)
					$('#input'+(i*4+j)+'').val(arrivalTime);
				else if (j == 2)
					$('#input'+(i*4+j)+'').val(execTime);
				else if (j == 3)
					$('#input'+(i*4+j)+'').val(period);
			}
		}	
	}

	/*
	 * Reset the allocation for all processes when simulator is restarted
	 */
	this.resetProcessAllocation = function()  {
		var pList = this.processList;
		for (var i in pList) {
			pList[i].executedCPU = "Not Allocated";
		}
	}

	/*
	 * Back up the processList before exiting
	 */
	this.setBackUpProcessList = function() {
		this.copyOfProcessList = this.processList;
	}

	this.getBackUpProcessList = function() {
		return this.copyOfProcessList;
	}

}

