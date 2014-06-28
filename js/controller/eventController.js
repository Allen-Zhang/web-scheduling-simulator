/*
 * Click function for Add Case button
 */ 
$('#add-case').click(function(){
	$('#myModal1').modal({'backdrop': 'static'});
	// Reset processList and CPUList
	resetObjList();
});

/*
 * Click function for Edit Case button
 */ 
$('#edit-process').click(function(){
	$('#myModal4').modal({'backdrop': 'static'});
	editProcess();
});

/*
 * Click function for Next button on modal1
 */ 
$('#show-modal2').click(function(){
	$('#myModal2').modal({'backdrop': 'static'});

	var scheme = $('#scheme').val();
	var html = "";
	// Display corresponding setting algorithm page base on the scheme and quantity of cpu used set
	if (scheme == "global") {
		html = '<div class="form-group">'
	            	+'<label class="col-sm-4 control-label">Select Algorithm</label>'
	                +'<div class="col-xs-5">'
	                	+'<select class="form-control" id="globalAlgorithm">'
						  +'<option value="default">---- Select a Algorithm ----</option>'
						  +'<option value="G-EDF">G-EDF</option>'
						  +'<option value="LLF">LLF</option>'
						  +'<option value="PF">PF</option>'
						+'</select>'
	                +'</div>'
	            +'</div>';

	}
	else if (scheme == "partitioned") {
		var cpuQty = $('#cpu-quantity').val();
		for (var i = 0; i < cpuQty; i++) {
			html += '<div class="form-group">'
	                	+'<label class="col-sm-5 control-label">Select Algorithm for CPU' + i + '</label>'
	                    +'<div class="col-xs-5">'
	                    	+'<select class="form-control" id="cpu' + i + '-alg">'
							  +'<option value="default">---- Select a Algorithm ----</option>'
							  +'<option value="P-EDF">P-EDF</option>'
							  +'<option value="PF">PF</option>'
							+'</select>'
	                    +'</div>'
	                +'</div>';
        }
	}
	$('#algorithm-list').html(html);

});

/*
 * Click function for Next button on modal2
 */ 
$('#show-modal3').click(function(){
	$('#myModal3').modal({'backdrop': 'static'});
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
				var input=$("<input id='input"+(i*4+j)+"'class='form-control'></input>");
				input.appendTo(td);
			}
		}
	}
});

/*
 * Click function for Finish button on modal3
 */ 
$('#save-case').click(function(){
	saveCase();
	showCaseSettings();
	showEditCaseButton();
	showCaseInfo();
});

function saveCase() {
	var scheme = $('#scheme').val();  // Get the scheme user selected
	var cpuQty = $('#cpu-quantity').val();  // Get the quantity of CPU
	var processQty=$("#process-quantity").val();  // Get the quantity of process

	if (scheme == "global") {
		var execAlg = $('#globalAlgorithm').val();  // Get the algorithm under global scheme user selected

		// Create CPU objects one by one and then add them to the CPUList
		for (var i = 0; i < cpuQty; i++) {
			var cid = cpu_manager.getNextID();
			var cpu = new CPU(cid, execAlg);
			cpu_manager.addCPU(cpu);
		}
	}
	else if (scheme == "partitioned") {
		// Create CPU objects one by one and then add them to the CPUList
		for (var i = 0; i < cpuQty; i++) {
			var cid = cpu_manager.getNextID();
			var execAlg = $('#cpu' + i + '-alg').val();  // Get the algorithm under partitioned scheme user selected
			var cpu = new CPU(cid, execAlg);
			cpu_manager.addCPU(cpu);
		}
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
	// Create a simulator object
	simulator = new Simulator(scheme, rList, pList);

	// For Testing CPU
	// for (var j = 0; j < simulator.resourceList.length; j++) {
	// 	alert('cid = '+simulator.resourceList[j].cid + ' // '+'name = '+simulator.resourceList[j].name + ' // '+'alg = '+simulator.resourceList[j].executedAlgorithm);
	// }
	// For Testing Process
	// for (var j = 0; j < simulator.processList.length; j++) {
	// 	alert('pid = '+simulator.processList[j].pid + ' // '+'name = '+simulator.processList[j].name + ' // '+'a time = '+simulator.processList[j].arrivalTime+ ' // '+'period = '+simulator.processList[j].period+ ' // '+'exec time = '+simulator.processList[j].execTime);
	// }
}

function editProcess() {
	// Get all process information from saved simulator object respectively
	var process = simulator.processList;
	var rowCount = process.length; 

	var table=$("<table id='edit-process-table' border='0'></table>");
   	table.appendTo($("#edit-process-table-div"));

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
		var tr=$("<tr></tr>");
		tr.appendTo(table);
		for(var j = 0; j < 5; j++) {
			var td=$("<td></td>");
			td.appendTo(tr);
			if(j==0){
			  var text=$("<span>Process"+i+"</span>");
			  text.appendTo(td);
			}
			if(j==1){
				var input=$("<input class='form-control' value="+process[i].arrivalTime+"></input>");
				input.appendTo(td);
			}
			if(j==2){
				var input=$("<input class='form-control' value="+process[i].execTime+"></input>");
				input.appendTo(td);
			}
			if(j==3){
				var input=$("<input class='form-control' value="+process[i].period+"></input>");
				input.appendTo(td);
			}
			if(j==4){
			  var text=$('<a href="#" class="delete-process">&times</a>');
			  text.appendTo(td);
			}
		}
	}
}

function showCaseSettings() {
	//scheme info show
	$("#scheme-text").html(simulator.scheme);

	//CPU info show
	var html="<table class='table table-hover'><tr class='info'>"
				+"<th>CID</th>"
				+"<th>CPU name</th>"
				+"<th>Algorithm</th></tr>";
	for(var i=0;i<simulator.resourceList.length;i++){
		var CPU = simulator.resourceList[i];
		html+="<tr>"
				+"<td>"+CPU.cid+"</td>"
				+"<td>"+CPU.name+"</td>"
				+"<td>"+CPU.executedAlgorithm+"</td>"
			+"</tr>";
	}
	html+="</table>";
	$("#resource-text").html(html);

	//Process info show
	html="<table class='table table-hover'><tr class='info'>"
			+"<th>PID</th>"
			+"<th>Process name</th>"
			+"<th>Arrive Time</th>"
			+"<th>Execution Time</th>"
			+"<th>Period</th></tr>";
	for(var i=0;i<simulator.processList.length;i++){
		var process = simulator.processList[i];
		html+="<tr>"
				+"<td>"+process.pid+"</td>"
				+"<td>"+process.name+"</td>"
				+"<td>"+process.arrivalTime+"</td>"
				+"<td>"+process.execTime+"</td>"
				+"<td>"+process.period+"</td>"
			+"</tr>";
	}
	html+="</table>";
	$("#process-text").html(html);
}

function showCaseInfo() {
	$("#no-case-info-text").hide();
	$("#case-info-div").show();
}

// Function for showing and hiding Edit Case button
function showEditCaseButton() {
	if (typeof simulator === 'undefined') 
		$('#edit-process').hide();
	else
		$('#edit-process').show(); 
}

function resetObjList() {
	process_manager.resetProcessList();
	cpu_manager.resetCPUList();
}

function saveEditProcess() {

	var scheme = simulator.scheme;
	var rList = simulator.resourceList;

	// Create Process objects one by one and then add them to the processList
	for(var i = 0; i < processQty; i++) {

		var pid = process_manager.getNextID();
		var arrivalTime=$("#input"+(i*4+1)).val();
		var execTime=$("#input"+(i*4+2)).val();
		var period=$("#input"+(i*4+3)).val();
		var process=new Process(pid,arrivalTime,execTime,period);
		process_manager.addProcess(process);
		// alert(process_manager.processList[i].arrivalTime+"//"+process_manager.processList[i].period);
	}
	
	var rList = cpu_manager.CPUList;
	var pList = process_manager.processList;
	// Create a simulator object
	simulator = new Simulator(scheme, rList, pList);



	// // Create Process objects one by one and then add them to the processList
	// for(var i=0;i<processQty;i++){
	// 	var pid=process_manager.getNextID();
	// 	var arrivalTime=$("#edit-input"+(i*4+1)).val();
	// 	var execTime=$("#edit-input"+(i*4+2)).val();
	// 	var period=$("#edit-input"+(i*4+3)).val();
	// 	var process=new Process(pid,arrivalTime,execTime,period);
	// 	process_manager.addProcess(process);
	// 	// alert(process_manager.processList[i].arrivalTime+"//"+process_manager.processList[i].period);
	// }
	
	// var rList = cpu_manager.CPUList;
	// var pList = process_manager.processList;
	// // Create a simulator object
	// simulator = new Simulator(scheme, rList, pList);
	
}