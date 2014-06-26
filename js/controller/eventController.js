/*
 * Click function for Add Case button
 */ 
$('#add-case').click(function(){$('#myModal1').modal({'backdrop': 'static'});});


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
			var input=$("<input class='form-control'></input>")
			input.appendTo(td);
		}
	}
	}
});


/*
 * Click function for Finish button on modal3
 */ 
$('#save-case').click(function(){
	
	var process = new Process();
	process.startTime = 2;

	process_manager.addProcess(process);
	alert(process_manager.aa);



	var scheme = $('#scheme').val();
	if (scheme == "global") {

		$('#globalAlgorithm').val();

	}
	else if (scheme == "partitioned") {


	var cpu = new CPU(executedAlgorithm);

	var simulator = new Simulator(scheme, resourceList, processList);



});