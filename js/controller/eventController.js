/*
 * Click function for Add Case button
 */ 
$('#add-case').click(function(){
	$('#myModal1').modal({'backdrop': 'static'});
	// Reset processList and CPUList
	resetObjList();
});

/*
 * Click function for Next button on modal1
 */ 
$('#show-modal2').click(function(){
	$('#myModal2').modal({'backdrop': 'static'});
	var scheme = $('#scheme').val();
	// Display corresponding setting algorithm page base on the scheme and quantity of cpu used set
	var html = addSchemeSelector(scheme);
	$('#algorithm-list').html(html);

});

/*
 * Click function for Next button on modal2
 */ 
$('#show-modal3').click(function(){
	$('#myModal3').modal({'backdrop': 'static'});
});

/*
 * Click function for Finish button on modal3
 */ 
$('#save-case').click(function(){
	saveCase();
	showCaseSettings();
	showEditCaseButton();
});

/*
 * Click function for Edit Case button
 */ 
$('#edit-case').click(function(){
	$('#myModal4').modal({'backdrop': 'static'});
	editCase();
});

/*
 * Click function for adding a new process
 */
$('#add-process').click(function(){
	addProcess();
});

/*
 * Click function for edit save process button 
 */
$('#save-edit-case').click(function(){
	saveEditCase();
	showCaseSettings();
});

/*
 * Display process setting form base on the quantity of process used set
 */
$("#process-quantity").change(function(){
    $("#process-table").remove();
	var rowCount= $("#process-quantity").val();
    var table=$("<table id='process-table' border='0'></table>");
   	table.appendTo($("#process-table-div"));

	var tr=$("<tr></tr>");
	tr.appendTo(table);
	var th=$("<th>PID</th>");
	th.appendTo(tr);
	var th=$("<th>Arrive Time</th>");
	th.appendTo(tr);
	var th=$("<th>Execution Time</th>");
	th.appendTo(tr);
	var th=$("<th>Period</th>");
	th.appendTo(tr);

	for(var i=0;i<rowCount;i++)
	{
		var tr=$("<tr></tr>");
		tr.appendTo(table);
		for(var j=0;j<4;j++)
		{
			var td=$("<td></td>");
			td.appendTo(tr);
			if(j==0){
			  var text=$("<span>Process"+i+"</span>");
			  text.appendTo(td);
			}
			else{
				var input=$("<input id='input"+(i*4+j)+"' class='form-control'></input>");
				input.appendTo(td);
			}
		}
	}
});

$("#start-simulator").click(function(){
	cleanResultPanel();

	$("#result-display-panel").css("width","2050px")
	drawResultPanel();
	showNextEvents();
	$('#start-running').hide();
	$('#stop-running').show();

	simulator.startSimulator();
	showCaseSettings();

	simulator.calculateHyperperiod();
});


$("#stop-simulator").click(function(){
	$('#stop-running').hide();
	$('#start-running').show();	
});

$("#step-forward").click(function(){
	showNextEvents();
});

$("#step-back").click(function(){
	removeCurrentEvents();
});

$("#finish-simulator").click(function(){
	showAllEvent();
});


function addSchemeSelector(scheme) {
	var html = "";
	if (scheme == "global") {
		html = '<div class="form-group">'
	            	+'<label class="col-sm-4 control-label">Select an Algorithm</label>'
	                +'<div class="col-xs-5">'
	                	+'<select class="form-control" id="g-Algorithm">'
						  +'<option value="default">---- Select an Algorithm ----</option>'
						  +'<option value="G-EDF">G-EDF</option>'
						  +'<option value="LLF">LLF</option>'
						  +'<option value="PF">PF</option>'
						  +'<option value="RMS">RMS</option>'
						+'</select>'
	                +'</div>'
	            +'</div>';

	}
	else if (scheme == "partitioned") {
		html += '<div class="form-group">'
                	+'<label class="col-sm-4 control-label">Select an Algorithm</label>'
                    +'<div class="col-xs-5">'
                    	+'<select class="form-control" id="p-Algorithm">'
						  +'<option value="default">---- Select an Algorithm ----</option>'
						  +'<option value="P-EDF">P-EDF</option>'
						  +'<option value="RMS">RMS</option>'
						+'</select>'
                    +'</div>'
                +'</div>';
	}
	return html;
}



function saveCase() {
	var scheme = $('#scheme').val();  // Get the scheme user selected
	var cpuQty = $('#cpu-quantity').val();  // Get the quantity of CPU
	var processQty=$("#process-quantity").val();  // Get the quantity of process
	var execAlg = "";

	if (scheme == "global")  // Get the algorithm under global scheme
		execAlg = $('#g-Algorithm').val();  
	else if (scheme == "partitioned") 	// Get the algorithm under partitioned scheme	
		execAlg = $('#p-Algorithm').val();  

	// Create CPU objects one by one and then add them to the CPUList
	for (var i = 0; i < cpuQty; i++) {
		var cid = cpu_manager.getNextID();
		var cpu = new CPU(cid);
		cpu_manager.addCPU(cpu);
	}

	// Create Process objects one by one and then add them to the processList
	for(var i=0;i<processQty;i++){
		var pid=process_manager.getNextID();
		var arrivalTime=$("#input"+(i*4+1)).val();
		var execTime=$("#input"+(i*4+2)).val();
		var period=$("#input"+(i*4+3)).val();
		var process=new Process(pid,arrivalTime,execTime,period);
		process_manager.addProcess(process);
		// alert(process_manager.processList[i].arrivalTime+"//"+process_manager.processList[i].period);
	}
	
	var rList = cpu_manager.CPUList;
	var pList = process_manager.processList;
	
	// Update simulator object
	simulator.scheme = scheme;
	simulator.algorithm = execAlg;
	simulator.resourceList = rList;
	simulator.processList = pList;

	// For Testing CPU
	// for (var j = 0; j < simulator.resourceList.length; j++) {
	// 	alert('cid = '+simulator.resourceList[j].cid + ' // '+'name = '+simulator.resourceList[j].name + ' // '+'alg = '+simulator.resourceList[j].executedAlgorithm);
	// }
	// For Testing Process
	// for (var j = 0; j < simulator.processList.length; j++) {
	// 	alert('pid = '+simulator.processList[j].pid + ' // '+'name = '+simulator.processList[j].name + ' // '+'a time = '+simulator.processList[j].arrivalTime+ ' // '+'period = '+simulator.processList[j].period+ ' // '+'exec time = '+simulator.processList[j].execTime);
	// }
}

function editCase() {

	var execAlg = simulator.algorithm;
	var scheme = simulator.scheme;
	var html = "";

	if (scheme == "global") {
		html = addSchemeSelector(scheme).replace("g-Algorithm","edit-g-Algorithm")+'<br/>';  // Change id value
		$("#edit-case-table-div").html(html);
		$('#edit-g-Algorithm option[value="'+execAlg+'"]').prop('selected', 'selected');
	}
	else if (scheme == "partitioned") {
		html = addSchemeSelector(scheme).replace("p-Algorithm","edit-p-Algorithm")+'<br/>';  // Change id value
		$("#edit-case-table-div").html(html);
		$('#edit-p-Algorithm option[value="'+execAlg+'"]').prop('selected', 'selected');
	}

	// Get all process information from saved simulator object respectively
	var process = simulator.processList;
	var rowCount = process.length; 

	$("#edit-case-table").remove();

	var table=$("<table id='edit-case-table' border='0'></table>");
   	table.appendTo($("#edit-case-table-div"));

	var tr=$("<tr></tr>");
	tr.appendTo(table);
	var th=$("<th>PID</th>");
	th.appendTo(tr);
	var th=$("<th>Arrive Time</th>");
	th.appendTo(tr);
	var th=$("<th>Execution Time</th>");
	th.appendTo(tr);
	var th=$("<th>Period</th>");
	th.appendTo(tr);
	var th=$("<th>Delete</th>");
	th.appendTo(tr);

	for(var i = 0; i < rowCount; i++) {
		if(process[i].active == true){
			var tr=$("<tr id='process"+i+"-row'></tr>");
			tr.appendTo(table);
			for(var j = 0; j < 5; j++) {
				var td=$("<td></td>");
				td.appendTo(tr);
				if(j==0){
				  var text=$("<span>Process"+i+"</span>");
				  text.appendTo(td);
				}
				if(j==1){
					var input=$("<input class='form-control' id='edit-input"+(i*5+j)+"' value="+process[i].arrivalTime+"></input>");
					input.appendTo(td);
				}
				if(j==2){
					var input=$("<input class='form-control' id='edit-input"+(i*5+j)+"' value="+process[i].execTime+"></input>");
					input.appendTo(td);
				}
				if(j==3){
					var input=$("<input class='form-control' id='edit-input"+(i*5+j)+"' value="+process[i].period+"></input>");
					input.appendTo(td);
				}
				if(j==4){
				  var text=$('<a href="#" class="delete-process" onclick="deactivateProcess('+i+')">&times</a>');
				  text.appendTo(td);
				}
			}
		}
	}
}

function showCaseSettings() {
	//scheme info show
	$("#scheme-text").html(simulator.scheme);
	$("#algorithm-text").html(simulator.algorithm);

	//CPU info show
	var html="<table class='table table-hover'><tr class='info'>"
				+"<th>CID</th>"
				+"<th>CPU Name</th>"
				+"</tr>";
	for(var i=0;i<simulator.resourceList.length;i++){
		var CPU = simulator.resourceList[i];
		html+="<tr>"
				+"<td>"+CPU.cid+"</td>"
				+"<td>"+CPU.name+"</td>"
			+"</tr>";
	}
	html+="</table>";
	$("#resource-text").html(html);

	//Process info show
	html="<table class='table table-hover'><tr class='info'>"
			+"<th>PID</th>"
			+"<th>Process Name</th>"
			+"<th>Arrive Time</th>"
			+"<th>Execution Time</th>"
			+"<th>Period</th>";
	if(simulator.scheme == "partitioned")
		html+="<th>executedCPU</th>";
	html += "<th>color</th></tr>";
	
	for(var i=0;i<simulator.processList.length;i++){
		var process = simulator.processList[i];
		if(process.active == true){
			html+="<tr>"
					+"<td>"+process.pid+"</td>"
					+"<td>"+process.name+"</td>"
					+"<td>"+process.arrivalTime+"</td>"
					+"<td>"+process.execTime+"</td>"
					+"<td>"+process.period+"</td>";
			if(simulator.scheme == "partitioned")
				html+="<td>"+process.executedCPU+"</td>";
			html+="<td style='background-color: "+process.showColor+";'> </td>"
				+"</tr>";
		}
	}
	html+="</table>";
	$("#process-text").html(html);
}


// Function for showing and hiding Edit Case button
function showEditCaseButton() {
	if (typeof simulator === 'undefined') 
		$('#edit-case').hide();
	else
		$('#edit-case').show(); 
}

function resetObjList() {
	process_manager.resetProcessList();
	cpu_manager.resetCPUList();
}

function saveEditCase() {
	var execAlg = "";

	if (simulator.scheme == "global")  // Get the algorithm under global scheme
		execAlg = $('#edit-g-Algorithm').val();  
	else if (simulator.scheme == "partitioned") 	// Get the algorithm under partitioned scheme	
		execAlg = $('#edit-p-Algorithm').val();  

	var processes = simulator.processList
	var processQty = processes.length;

	// Create Process objects one by one and then add them to the processList
	for(var i = 0; i < processQty; i++) {
		var arrivalTime = $("#edit-input"+(i*5+1)).val();
		var execTime = $("#edit-input"+(i*5+2)).val();
		var period = $("#edit-input"+(i*5+3)).val();

		// Renew process attribute value
		processes[i].arrivalTime = arrivalTime;
		processes[i].execTime = execTime;
		processes[i].period = period;
	}
	
	// Update simulator object
	simulator.algorithm = execAlg;
	simulator.processList = processes;
	
}


/*
 * Function for adding a new process after 
 * clicking Add Process button on modal4
 */ 
function addProcess() {
	// Create a new process and push to processlist
	var newPid = simulator.processList.length;
	var newProcess = new Process(newPid);
	simulator.processList.push(newProcess);

	var table = $('#edit-case-table');
	var newTr = $("<tr id='process"+newPid+"-row'></tr>");
	newTr.appendTo(table);
	for (var j = 0; j < 5; j++) {
		var td = $("<td></td>");
		td.appendTo(newTr);
		if (j == 0) {
		  var text = $("<span>Process"+newPid+"</span>");
		  text.appendTo(td);
		}
		if (j > 0 && j < 4) {
			var input = $("<input id='edit-input"+(newPid*5+j)+"' class='form-control'></input>");
			input.appendTo(td);
		}
		if (j == 4) {
			  var text=$('<a href="#" class="delete-process" onclick="deactivateProcess('+newPid+')">&times</a>');
			  text.appendTo(td);
		}
	}
}

/*
 * Function for deactivate a exist process 
 * after clicking Delete button on modal4
 */ 
function deactivateProcess(pid) {
	var processes = simulator.processList
	var processQty = processes.length;
	for (var i =0; i < processQty; i++) {
		if (processes[i].pid == pid) {
			processes[i].active = false;
			$("#process"+i+"-row").remove();
		}
			
	}
}


