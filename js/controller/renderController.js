

function cleanResultPanel() {
	$("#result-display-title").html("");
	$("#result-display-panel").html("");
}

function drawResultPanel() {
	//draw event diagram
	drawDiagram(-1);
	//draw CPU diagrams
	var cpuQty=simulator.resourceList.length;
	for(var i=0;i<cpuQty;i++){
		drawDiagram(simulator.resourceList[i].cid);
	}
}

function drawDiagram(cid){
	//add title content
	var title;
	if(cid<0)
		title=$("<div class='result-title'>Event</div>");
	else
		title=$("<div class='result-title'>CPU"+cid+"</div>");

	title.appendTo($("#result-display-title"));

	//draw a diagram
	var table=$("<table id='cpu-table' border='0'></table>");
   	table.appendTo($("#result-display-panel"));
	for(var i=0;i<3;i++)
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
		}
	}
}

<<<<<<< HEAD
// function nextEvent(start,end,pid,cid){
// 	var td="#table"+cid+"td"+start;
// 	var length=(end-start)*40;
// 	var div=$("<div style='width:"+length+"px;height:55px;background-color: "+simulator.processList[pid].showColor+";'> P"+pid+"</div>")
// 	div.appendTo($(td));
// }

=======
>>>>>>> origin/master
function renderNextEvent(recorder){
	var pid = recorder.pid;
	var cid = recorder.cid;
	var type = recorder.eventType;
	var start = recorder.eventStartTime;
	var end = recorder.eventEndTime;
<<<<<<< HEAD
	var color = simulator.processList[pid].showColor;
	if (type == "execution") {	
		var td = "#table"+cid+"td"+start;
		var length = (end-start)*40;
		var div=$("<div style='width:"+length+"px;height:55px;background-color: "+color+";'> P"+pid+"</div>");
		div.appendTo($(td));
		alert(td);
	}
	else {
	}

=======

	var td = "#table"+cid+"td"+start;
	var length = (end-start)*40;
	var div = $("<div style='width:"+length+"px; height:55px; background-color: red;'>1</div>")
	div.appendTo($(td));
>>>>>>> origin/master
}