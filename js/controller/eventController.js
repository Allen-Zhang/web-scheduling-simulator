
// Click function for Add Case button
$('#add-case').click(function(){
	$('#myModal1').modal({'backdrop': 'static'});
	// Reset processList and CPUList
	resetObjList();
	cleanResultPanel();
	recorder_manager.recorderList.length = 0;
	recorder_manager.recorderSequence.length = 0;
});

// Click function for Next button on modal1 
$('#show-modal2').click(function(){
	// Form validation 
	if ($(".form-myModal1").valid() == true) {
		// Go to the next modal
		$("#show-modal2").attr('data-dismiss','modal');
		$('#myModal2').modal({'backdrop': 'static'});
		var scheme = $('#scheme').val();
		// Display corresponding setting algorithm page base on the scheme and quantity of cpu used set
		var html = addSchemeSelector(scheme);
		$('#algorithm-list').html(html);
	}
});

// Click function for Next button on modal2
$('#show-modal3').click(function(){
	// Form validation 
	if ($(".form-myModal2").valid() == true) {
		// Go to the next modal
		$("#show-modal3").attr('data-dismiss','modal');
		$('#myModal3').modal({'backdrop': 'static'});
	}
});

// Display process setting form base on the quantity of process used set
$("#process-quantity").blur(function(){
	$("#process-table").remove();
	// Form validation 
	if ($(".form-myModal3").valid() == true) {
		$("#random-process").fadeIn(); 
		$(".save-process-group").fadeIn();		
		process_manager.drawProcessTable();
	} else {
		$("#random-process").hide();
		$(".save-process-group").hide();
	}
});

// Click function for save process button
$("#save-process").click(function(){
	// Form validation
	if ($(".form-myModal3").valid() == true && 
			validateProcessUnit("process-table", $("#process-quantity").val())) {
		process_manager.saveProcessAsTxtFile();
	} 
});

// Click function for load process button
$("#load-process").click(function(){
	process_manager.loadProcess();
});

// Click function for radomize button
$("#random-process").click(function(){
	if ($(".form-myModal3").valid() == true) {
		process_manager.randomizeProcess();
	}
});

// Click function for Finish button on modal3
$('#save-case').click(function(){
	// Form validation 
	if ($(".form-myModal3").valid() == true && 
			validateProcessUnit("process-table", $("#process-quantity").val())) {
		// Save the case
		$("#save-case").attr('data-dismiss','modal');
		saveCase();
		showCaseSettings();
		showEditCaseAndStartButton();
	} else {
		$("#save-case").removeAttr('data-dismiss','modal');
	}
});

// Click function for Edit Case button
$('#edit-case').click(function(){
	$('#myModal4').modal({'backdrop': 'static'});
	// Back up the processList
	process_manager.setBackUpProcessList();
	editCase();
});

// Click function for adding a new process on edit case page
$('#add-process').click(function(){
	process_manager.addNewEditProcess();
});

// Click function for edit save process button 
$('#save-edit-case').click(function(){
	// Form validation 
	if ($(".form-myModal4").valid() == true && 
			validateProcessUnit("edit-case-table", process_manager.processList.length)) {
		// Save the case
		$("#save-edit-case").attr('data-dismiss','modal');
		saveEditCase();
		showCaseSettings();
	} else {
		$("#save-edit-case").removeAttr('data-dismiss','modal');
	}
});

// Click function for cancel edit case button
$("#cancel-edit-case").click(function(){ 
	var copy = process_manager.getBackUpProcessList();
	// Recover the processList
	process_manager.processList = copy;
});

// Click function for start simulator button
$("#start-simulator").click(function(){				
	$("#result-legend").show();	
	$('#case-panel').hide();
	$('#start-running').hide();
	$('#stop-running').fadeIn('fast');

	recorder_manager.recorderList.length = 0;
	recorder_manager.recorderSequence.length = 0;

	initializeData();
	cleanResultPanel();

	drawResultPanel();
	$("#result-display-panel").css("width","1500px");
	var height = simulator.resourceList.length * 190;
	$("#result-recorder-div").css("height",height+"px");
	$(".result-global-readyqueue").css("height",height+"px");

	simulator.startSimulator();
	recorder_manager.handleRecorderSequence();

	showNextEvents();
	showCaseSettings();
});

// Click function for stop simulator button
$("#stop-simulator").click(function(){
	recorder_manager.resetIndex();
	$('.event').remove();
	$('.runningP-div').empty();
	$('#result-recorder-table').empty();
	$('#case-panel').fadeIn('fast');
	$('#start-running').fadeIn('fast');
	$('#stop-running').hide();
	process_manager.resetProcessAllocation();
	showCaseSettings();
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
	                	+'<select class="form-control" id="g-Algorithm" name="algorithm">'
						  +'<option value="">---- Select an Algorithm ----</option>'
						  +'<option value="G-EDF">G-EDF</option>'
						  +'<option value="G-RMS">G-RMS</option>'
						  +'<option value="LLF">LLF</option>'
						+'</select>'
	                +'</div>'
	            +'</div>';
	}
	else if (scheme == "partitioned") {
		html += '<div class="form-group">'
                	+'<label class="col-sm-4 control-label">Select an Algorithm</label>'
                    +'<div class="col-xs-5">'
                    	+'<select class="form-control" id="p-Algorithm" name="algorithm">'
						  +'<option value="">---- Select an Algorithm ----</option>'
						  +'<option value="P-EDF">P-EDF</option>'
						  +'<option value="P-RMS">P-RMS</option>'
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
	}
	
	// Update simulator object
	simulator.scheme = scheme;
	simulator.algorithm = execAlg;

	// Change the main page title
	changeAlgTitle(execAlg);

	// For Testing CPU
	// for (var j = 0; j < simulator.resourceList.length; j++) {
	// 	alert('cid = '+simulator.resourceList[j].cid + ' // '+'name = '+simulator.resourceList[j].name + ' // '+'alg = '+simulator.resourceList[j].executedAlgorithm);
	// }
	// For Testing Process
	// for (var j = 0; j < simulator.processList.length; j++) {
	// 	alert('pid = '+simulator.processList[j].pid + ' // '+'name = '+simulator.processList[j].name + ' // '+'a time = '+simulator.processList[j].arrivalTime+ ' // '+'period = '+simulator.processList[j].period+ ' // '+'exec time = '+simulator.processList[j].execTime);
	// }
}

/*
 * Function for changing the title of main page
 */
function changeAlgTitle(algorithm) {
	$("#alg-title").html(algorithm);
}

function showCaseSettings() {
	// Scheme information
	$("#scheme-text").html("<b>" + simulator.scheme + "</b>");
	// Algorithm information
	$("#algorithm-text").html("<b>" + simulator.algorithm + "</b>");
	// Workload information
	var results = simulator.compareTotalProcessUtilWithTotalCpuRemainingUtil();
	var workloadHtml = "<table id='workload-table'>"
						  + "<tr>"
							  + "<td>Total process utilization: <b>" + results.totalProUtil + "</b></td>"
							  + "<td>Total CPU utilization: <b>" + results.totalCpuUtil + "</b></td>"
							  + "<td>Status: <b>" + results.condition + "</b></td>"
						  + "</tr>"
					  + "</table>"
	$("#workload-text").html(workloadHtml);

	//CPU info show
	var html="<table class='table table-hover'><tr class='info'>"
				+"<th>CID</th>"
				+"<th>CPU Name</th>"
				+"</tr>";
	for(var i=0;i<cpu_manager.CPUList.length;i++){
		var CPU = cpu_manager.CPUList[i];
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
			+"<th>Arrival Time</th>"
			+"<th>Execution Time</th>"
			+"<th>Period</th>";
	if(simulator.scheme == "partitioned")
		html+="<th>Executed CPU</th>";
	html += "<th>Color</th></tr>";
	
	for(var i=0;i<process_manager.processList.length;i++){
		var process = process_manager.processList[i];
			html+="<tr>"
					+"<td>"+process.pid+"</td>"
					+"<td>"+process.name+"</td>"
					+"<td>"+process.arrivalTime+"</td>"
					+"<td>"+process.execTime+"</td>"
					+"<td>"+process.period+"</td>";
			if(simulator.scheme == "partitioned") {
				html+="<td>"+process.executedCPU+"</td>";
			}
			html+="<td style='background-color: "+process.showColor+";'> </td>"
				+"</tr>";
	}
	html+="</table>";
	$("#process-text").html(html);
}


/*
 * Function for showing and hiding Edit Case and Start Simulator button
 */
function showEditCaseAndStartButton() {
	if (typeof simulator === 'undefined') {
		$('#edit-case').hide();
		$('#start-running').hide();
	}
	else {
		$('#edit-case').fadeIn('fast');
		$('#start-running').fadeIn('fast'); 
	}
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
	var process = process_manager.processList;
	var rowCount = process.length; 
	$("#edit-case-table").remove();

	var table=$("<table id='edit-case-table' border='0'></table>");
   	table.appendTo($("#edit-case-table-div"));

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
	var th=$("<th>Delete</th>");
	th.appendTo(tr);

	for(var i = 0; i < rowCount; i++) {
		//if(process[i].active == true){
			var tr=$("<tr id='process"+i+"-row'></tr>");
			tr.appendTo(table);
			for(var j = 0; j < 5; j++) {
				var td=$("<td></td>");
				td.appendTo(tr);
				if(j == 0){
				  var text=$("<span>Process"+process[i].pid+"</span>");
				  text.appendTo(td);
				} else if(j == 1){
					var input=$("<input class='form-control p-unit' id='edit-input"+(i*5+j)+"' value="+process[i].arrivalTime+"></input>");
					input.appendTo(td);
				} else if(j == 2){
					var input=$("<input class='form-control p-unit p-exec"+i+"' id='edit-input"+(i*5+j)+"' value="+process[i].execTime+"></input>");
					input.appendTo(td);
				} else if(j == 3){
					var input=$("<input class='form-control p-unit p-period"+i+"' id='edit-input"+(i*5+j)+"' value="+process[i].period+"></input>");
					input.appendTo(td);
				} else if(j == 4){
				  var text=$('<a href="#" class="delete-process" onclick="process_manager.deactivateProcess('+i+')">&times</a>');
				  text.appendTo(td);
				}
			}
		//}
	}
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

	var processes = process_manager.processList;
	var processQty = processes.length;

	// Create Process objects one by one and then add them to the processList
	for(var i = 0; i < processQty; i++) {
		var arrivalTime = $("#edit-input"+(i*5+1)).val();
		var execTime = $("#edit-input"+(i*5+2)).val();
		var period = $("#edit-input"+(i*5+3)).val();
		//var process = new Process(processes[i].pid,arrivalTime,execTime,period);
		// Renew process attribute value
		processes[i].execTime = execTime;
		processes[i].arrivalTime = arrivalTime;
		processes[i].period = period;

	}

	for(var i = 0; i < processQty; i++) {
		if(processes[i].active == false){
			processes.splice(i,1);
			i--;
			processQty--;
			//alert(processes[0].pid);
		}
	}
	// Update simulator object
	simulator.algorithm = execAlg;
	//simulator.processList = processes;
	
	// Change the main page title
	changeAlgTitle(execAlg);
}

function initializeData(){
	//initialize processList
	var processes = process_manager.processList;
	simulator.processList.length = 0;
	for(var i in processes){
		var process = new Process(processes[i].pid,processes[i].arrivalTime,processes[i].execTime,processes[i].period );
		simulator.processList[i]= process;
		//alert(process_manager.processList[i].pid+"|"+process_manager.processList[i].arrivalTime);
		//alert(simulator.processList[i].pid+"|"+simulator.processList[i].arrivalTime);
	}

	//initialize resouseList
	var resources = cpu_manager.CPUList;
	for(var i in resources){
		var resource = new CPU(resources[i].cid);
		simulator.resourceList[i] = resource;
	}

	//reset relative para
	simulator.finishEventList.length = 0;
}


