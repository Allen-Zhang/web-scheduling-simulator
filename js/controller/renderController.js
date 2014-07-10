

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

function drawEventDiagram(cid){
	//add title content
	var title;
	title=$("<div class='result-title' id='event-title'>Event</div>");
	title.appendTo($("#result-display-title"));

	//draw a diagram
	var table=$("<table id='event-table' border='0'></table>");
   	table.appendTo($("#result-display-panel"));
	for(var i=0;i<3;i++)
	{
		var tr=$("<tr></tr>");
		tr.appendTo(table);
		for(var j=0;j<50;j++)
		{	
			if(i==0){
				var td=$("<td class='row1'>"+j+"</td>");
				td.appendTo(tr);
			}
				if(i==1){
				var td=$("<td class='row2'> </td>");
				td.appendTo(tr);
			}
				if(i==2){				
				var td=$("<td class='row3' id='table"+cid+"td"+j+"'> </td>");
				td.appendTo(tr);
			}
		}
	}
}

function drawCPUDiagram(cid){
	//add title content
	var title;
	title=$("<div class='result-title'>CPU"+cid+"</div>");
	title.appendTo($("#result-display-title"));

	//draw a diagram
	var table=$("<table id='cpu-table' border='0'></table>");
   	table.appendTo($("#result-display-panel"));
	for(var i=0;i<4;i++)
	{
		var tr=$("<tr></tr>");
		tr.appendTo(table);
		for(var j=0;j<50;j++)
		{	
			if(i==0){
				var td=$("<td class='row1' id='table"+cid+"td"+j+"'> </td>");
				td.appendTo(tr);
			}
			if(i==1){
				var td=$("<td class='row2'> </td>");
				td.appendTo(tr);
			}
			if(i==2){
				var td=$("<td class='row3'>"+j+"</td>");
				td.appendTo(tr);
			}
			if(i==3){
				var td=$("<td class='row4' id='event-table"+cid+"td"+j+"'></td>");
				td.appendTo(tr);
			}
		}
	}
}

// function nextEvent(start,end,pid,cid){
// 	var td="#table"+cid+"td"+start;
// 	var length=(end-start)*40;
// 	var div=$("<div style='width:"+length+"px;height:55px;background-color: "+simulator.processList[pid].showColor+";'> P"+pid+"</div>")
// 	div.appendTo($(td));
// }

function showNextEvents(){
	var index = recorder_manager.getNextEventIndex();
	var recorder = recorder_manager.recorderList[index];  // Get the first recorder object
	$(".event").stop(true,true);
	renderNextEvent(recorder);

	var nextIndex;
	while(1){
		nextIndex = index+1;  // Get the next recorder index
		if(nextIndex == recorder_manager.recorderList.length)
			break;
		if( recorder_manager.recorderList[index].eventStartTime == recorder_manager.recorderList[nextIndex].eventStartTime ){
			index = recorder_manager.getNextEventIndex();
			recorder = recorder_manager.recorderList[nextIndex];  // Get the first recorder object
			renderNextEvent(recorder);			
		}else{
			break;
		}
		
	}
}


function renderNextEvent(recorder){
	var pid = recorder.pid;
	var cid = recorder.cid;
	var type = recorder.eventType;
	var start = recorder.eventStartTime;
	var end = recorder.eventEndTime;
	var color = simulator.processList[pid].showColor;
	var divID = "result-div"+recorder_manager.index;

	if (type == "execution") {	
		var td = "#table"+cid+"td"+start;
		var length = (end-start)*40;
		var div = $("<div class='cpu-div event' id='"+divID+"' style='width:0px;height:55px;background-color: "+color+";'> P"+pid+"</div>");
		div.appendTo($(td));
		$("#"+divID).animate({width:length+'px',opacity:'0.8'},1000);
	}
	else {
		var td = "#event-table"+cid+"td"+start;
		var div = $("<div class='event-div event' id='"+divID+"' style='width:40px;height:15px;'>&#8593 P"+pid+"</div>");
		div.appendTo($(td));
		$("#"+divID).hide().fadeIn(1000);
	}
}


/*
 * Function for delete current event
 */
function removeCurrentEvents(){
	var index = recorder_manager.index;
	var recorder = recorder_manager.recorderList[index];
	$(".event").stop(true,true);
	deleteEvent(index);
	recorder_manager.index--;
	while(1){
		var preIndex = index-1;  // Get the next recorder index
		if(preIndex == -1)
			break;
		if( recorder_manager.recorderList[index].eventStartTime == recorder_manager.recorderList[preIndex].eventStartTime ){
			index = preIndex;
			recorder_manager.index--;
			deleteEvent(preIndex);			
		}else{
			break;
		}
		
	}
}

function deleteEvent(divID){

	$("#result-div"+divID).fadeOut(1000,function(){this.remove();});
}


function showAllEvent(){
	$(".event").remove();
	recorder_manager.index = -1;
	for(var i=0;i<recorder_manager.recorderList.length;i++){
		showNextEvents();
		$(".event").stop(true,true);
	}
}