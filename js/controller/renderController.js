

function cleanResultPanel() {
	$("#result-display-title").html("");
	$("#result-display-panel").html("");
}

function drawResultPanel() {
	//draw event diagram
	//drawEventDiagram("event");
	//draw CPU diagrams
	var cpuQty=simulator.resourceList.length;
	for(var i=0;i<cpuQty;i++){
		drawCPUDiagram(simulator.resourceList[i].cid);
	}
}

// function drawEventDiagram(cid){
// 	//add title content
// 	var title;
// 	title=$("<div class='result-title' id='event-title'>Event</div>");
// 	title.appendTo($("#result-display-title"));

// 	//draw a diagram
// 	var table=$("<table id='event-table' border='0'></table>");
//    	table.appendTo($("#result-display-panel"));
// 	for(var i=0;i<3;i++)
// 	{
// 		var tr=$("<tr></tr>");
// 		tr.appendTo(table);
// 		for(var j=0;j<50;j++)
// 		{	
// 			if(i==0){
// 				var td=$("<td class='row1'>"+j+"</td>");
// 				td.appendTo(tr);
// 			}
// 				if(i==1){
// 				var td=$("<td class='row2'> </td>");
// 				td.appendTo(tr);
// 			}
// 				if(i==2){				
// 				var td=$("<td class='row3' id='table"+cid+"td"+j+"'> </td>");
// 				td.appendTo(tr);
// 			}
// 		}
// 	}
// }

function drawCPUDiagram(cid){
	//add title content
	var title=$("<div class='result-title'>CPU"+cid+"</div>");
	title.appendTo($("#result-display-title"));

	//draw a CPU diagram
	var table=$("<table id='cpu-table' border='0'></table>");
   	table.appendTo($("#result-display-panel"));
	for(var i=0;i<5;i++)
	{
		var tr=$("<tr></tr>");
		tr.appendTo(table);
		for(var j=0;j<30;j++)
		{	
			if(i==0){
				var td=$("<td class='row1' id='miss-table"+cid+"td"+j+"'></td>");
				td.appendTo(tr);
			}
			if(i==1){
				var td=$("<td class='row2' id='table"+cid+"td"+j+"'> </td>");
				td.appendTo(tr);
			}
			if(i==2){
				var td=$("<td class='row3'> </td>");
				td.appendTo(tr);
			}
			if(i==3){
				var td=$("<td class='row4'>"+j+"</td>");
				td.appendTo(tr);
			}
			if(i==4){
				var td=$("<td class='row5' id='event-table"+cid+"td"+j+"'></td>");
				td.appendTo(tr);
			}
		}
	}
	//draw ready queue
	var title = $("<p>CPU"+cid+"</p><div class='runningP-div' id='currentRunningP"+cid+"'> </div><div class='result-readyqueue' id='result-readyqueue"+cid+"'></div>");
	title.appendTo($("#result-display-readyqueue"));
}


function showNextEvents(flag){
	var index = recorder_manager.getNextEventIndex();
	if(index>=0){
		for(var i in recorder_manager.recorderSequence[index]){
			var recorderIndex = recorder_manager.recorderSequence[index][i];
			renderNextEvent(recorderIndex,flag);
		}
	}
}


function renderNextEvent(eventIndex,flag){
	var recorder = recorder_manager.recorderList[eventIndex];
	var pid = recorder.pid;
	var cid = recorder.cid;
	var type = recorder.eventType;
	var start = recorder.eventStartTime;
	var end = recorder.eventEndTime;
	var color = simulator.processList[pid].showColor;
	var divID = "result-div"+eventIndex;
	var text = "";

	if (type == "execution") {	
		var td = "#table"+cid+"td"+start;
		var length = (end-start)*40;
		var div = $("<div class='cpu-div event' id='"+divID+"' style='width:0px;height:55px;background-color: "+color+";'> P"+pid+"</div>");
		div.appendTo($(td));
		$("#"+divID).animate({width:length+'px',opacity:'0.8'},1000);
		recorder_manager.previousExecutionEvent[cid] = end;
		text = "P"+pid+" executes on CPU"+cid;
	}
	if(type == "arrival"){
		var td = "#event-table"+cid+"td"+start;
		var div = $("<div class='event-div event' id='"+divID+"' style='width:40px;height:15px;'>&#8593 P"+pid+"</div>");
		div.appendTo($(td));
		$("#"+divID).hide().fadeIn(1000);
		text = "P"+pid+" arrives on CPU"+cid;
	}
	if(type == "interrupt"){
		var td = "#event-table"+cid+"td"+start;
		var div = $("<div class='event-div event' id='"+divID+"' style='width:40px;height:15px;color:blue;'>&#8593 P"+pid+"</div>");
		div.appendTo($(td));
		$("#"+divID).hide().fadeIn(1000);
		text = "P"+pid+" preempties on CPU"+cid;
	}
	if(type == "miss"){
		var td = "#miss-table"+cid+"td"+start;
		var div = $("<div class='event-div event' id='"+divID+"' style='width:40px;height:15px;color:red;'>&#8595 P"+pid+"</div>");
		div.appendTo($(td));
		$("#"+divID).hide().fadeIn(1000);
		text = "P"+pid+" misses";
	}
	//draw readyQueue
	var td = "#currentRunningP"+cid;
	if((type == "arrival"|| type == "interrupt") && start>=recorder_manager.previousExecutionEvent[cid]){
		$(td).html("");
	}
	if(type == "execution"){
		$(td).html("P"+pid+" ("+recorder.runningProcessDeadline+")");
	}


	var td = "#result-readyqueue"+cid;
	$(td).empty();
	for(var i in recorder.readyQueue){
		var	div = $("<div class='readyQueue-div event' >P"+recorder.readyQueue[i]+" ("+recorder.readyQueueDeadlines[i]+")</div>");
		div.appendTo($(td));
		if(type != "miss")
			div.hide().fadeIn(700);
	}

	//draw event recorder
	if(flag != 1){
		var div = $("<tr id='event-record"+eventIndex+"'><td class='col1'>"+start+"</td><td class='col2'>"+text+"</td></tr>");
		div.appendTo($("#result-recorder-table"));
		div.hide().fadeIn(700);
	}
}


/*
 * Function for delete current event
 */
function removeCurrentEvents(){
	var index = recorder_manager.getCurrentIndex();

	for(var i in recorder_manager.recorderSequence[index]){
		var recorderIndex = recorder_manager.recorderSequence[index][i];
		$("#event-record"+recorderIndex).fadeOut(500,function(){ this.remove();});
		if(i == recorder_manager.recorderSequence[index].length-1)
			deleteEvent(recorderIndex,1);
		else
			deleteEvent(recorderIndex,0);
	}
	// recorder_manager.gotoPreviousIndex();

	// //redraw readyqueue panel
	// var index = recorder_manager.getCurrentIndex();
	// for(var i in recorder_manager.recorderSequence[index]){
	// 		var recorderIndex = recorder_manager.recorderSequence[index][i];
	// 		var recorder = recorder_manager.recorderList[recorderIndex];
	// 		var cid = recorder.cid;
	// 		var td = "#result-readyqueue"+cid;
	// 		$(td).empty();
	// 		for(var j in recorder.readyQueue){
	// 			var	div = $("<div class='readyQueue-div event' >P"+recorder.readyQueue[j]+"</div>");
	// 			div.appendTo($(td));
	// 		}
	// }
	//$(".event").stop(false,true);
	// $(".event").remove();
	// var index = recorder_manager.getCurrentIndex();
	// recorder_manager.index = -1;

	// for(var i=0;i<index;i++){
	// 	showNextEvents();
	// }
	// $(".event").stop(true,true);
}

function deleteEvent(eventIndex,flag){
	if(flag == 1){
		$("#result-div"+eventIndex).fadeOut(600,function(){
			$(".event").remove();
			var index = recorder_manager.getCurrentIndex();
			recorder_manager.resetIndex();	
			for(var i=0;i<index;i++){
				showNextEvents(1);
			}
			$(".event").stop(true,true);
		});
	}
	else
		$("#result-div"+eventIndex).fadeOut(600,function(){ this.remove();});
}


function showAllEvent(){
	$(".event").remove();
	recorder_manager.resetIndex();
	for(var i=0;i<recorder_manager.recorderSequence.length;i++){
		showNextEvents();
	}
	$(".event").stop(true,true);
}