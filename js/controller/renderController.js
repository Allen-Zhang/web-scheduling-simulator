nextEvent(5,8,2);
nextEvent(9,18,2);

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
		title=$("<div class='result-title'>Event</div>")
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
			var td=$("<td class='row1' id='td"+j+"'> </td>");
			td.appendTo(tr);}
			if(i==1){
			var td=$("<td class='row2'> </td>");
			td.appendTo(tr);}
			if(i==2){
			var td=$("<td class='row3'>"+j+"</td>");
			td.appendTo(tr);}
		}
	}
}

function nextEvent(start,end,pid){
	var td="#td"+start;
	var length=(end-start)*30;
	var div=$("<div style='width:"+length+"px;height:55px;;background-color: red;'>1</div>")
	div.appendTo($(td));
}