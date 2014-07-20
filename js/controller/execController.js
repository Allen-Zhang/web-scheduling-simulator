
var cpu_manager = new CPUManager();
var process_manager = new ProcessManager();
var recorder_manager = new RecorderManager();
var simulator = new Simulator();  // Create an empty simulator object

/*
 * Function for file read operation 
 */
function loadProcess() {

    var files = document.getElementById('files').files;
    if (!files.length) {
      alert('Please choose a file.');
      return;
    }
    var file = files[0];
    var start = 0;
    var stop = file.size - 1;
    var reader = new FileReader();  
    var check = true;  

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      	if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      		
	        // Format file content
	        var content = evt.target.result.replace(/\;/g,",").split(",");
	        var p_unit = [];
	        for (var i = 0; i < content.length - 1; i++) {
			    p_unit.push(parseInt(content[i]));		
			    // Data validity validation
			    if (isNaN(p_unit[i])) {
			    	alert('Invalid p_unit['+i+']: '+p_unit[i]);
			    	check = false;
			    }
			}
			// Non empty validation
			if (p_unit.length == 0) {
				check = false;
			}
			if (check == true) {
				// Data size validation 
				var remainder = (p_unit.length) % 3;	
				if (remainder != 0) {  // Worng data size
					alert('Load process failed! Please choose other files.');
				} 
				else {  // Correct data size
					var processQty = (p_unit.length) / 3;
					$("#process-quantity").val(processQty);
					$("#process-quantity").blur();

					for(var i = 0; i < processQty; i++) {
						for(var j = 0; j < 4; j++) {
							var index = j - 1 + i * 3;
							if (j == 1)
								$('#input'+(i*4+j)+'').val(p_unit[index]);
							else if (j == 2)
								$('#input'+(i*4+j)+'').val(p_unit[index]);
							else if (j == 3)
								$('#input'+(i*4+j)+'').val(p_unit[index]);
						}
					}	
				}				
			} else {
				alert('Load process failed! Please choose other files.');
			}
	    }
	};
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}