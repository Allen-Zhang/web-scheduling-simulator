$(document).ready(function(){
	
	$('.form-myModal1').validate({
		 rules: {
		    'cpu-quantity': {
		      	required: true,
		      	digits: true,
		      	min: 1,
		      	max: 10    
		    },
		    'scheme': 'required'
		},
		messages:{
			'cpu-quantity': {
		      	min: 'Please enter at least 1 CPU.',
		      	max: 'No more than 10 CPUs.'
		    }
		}
	}); 

	$('.form-myModal2').validate({
		 rules: {
		    'algorithm': 'required'
		}
	}); 

	$('.form-myModal3').validate({
		 rules: {
		    'process-quantity': {
		      	required: true,
		      	digits: true,
		      	min: 1,
		      	max: 15    
		    }
		},
		messages:{
			'process-quantity': {
		      	min: 'Requrie at least 1 process.',
		      	max: 'No more than 15 processes.'
		    }
		}
	}); 	

	$('.form-myModal4').validate({
		 rules: {
		    'algorithm': 'required'
		}
	}); 

});

function validateProcessUnit(tableId, rowCount) {
	var checkOther = true;
	var checkExec = true;
	var isValid = true;
	// Not empty, not a negative number, and number validation
	$.each($('#'+tableId+' input[class*="p-unit"]'),function(i,e){
		if (e.value.length == 0 || e.value < 0 || isNaN(e.value)) {
			e.value = "";
			checkOther = false;
			isValid = false;
		}
	});
	// Execution time validation
	for(var i = 0; i < rowCount; i++) {
		var executionTime = parseInt($('#'+tableId+' input[class*="p-exec'+i+'"]').val());
		var period = parseInt($('#'+tableId+' input[class*="p-period'+i+'"]').val());
		// execution time must be smaller than period
		if (executionTime > period) { 
			$('.p-exec'+i+'').val(''); 
			checkExec = false;
			isValid =false;
		}
	}
	if (checkExec == false)
		alert("Execution time must be smaller than period.");
	if (checkOther == false)
		alert("Please enter all valid process information.");

	// alert(isValid);
	return isValid;
}