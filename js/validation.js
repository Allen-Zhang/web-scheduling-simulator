$(document).ready(function(){
	
	$('.form-myModal1').validate({
		 rules: {
		    'cpu-quantity': {
		      	required: true,
		      	digits: true,
		      	min: 1    
		    },
		    'scheme': 'required'
		},
		messages:{
			'cpu-quantity': {
		      	min: 'Please enter at least 1 CPU.'
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
		      	min: 1    
		    }
		},
		messages:{
			'process-quantity': {
		      	min: 'Requrie at least 1 process.'
		    }
		}
	}); 	

	$('.form-myModal4').validate({
		 rules: {
		    'algorithm': 'required'
		}
	}); 

});

function validateProcessUnit() {
	var check = true;
	$.each($('.p-unit'),function(i,e){
		if (e.value.length == 0 || e.value < 0 || isNaN(e.value)) {
			e.value = "";
			check = false;
		}
	});
	if (check == false)
		alert("Please enter all valid process information.");
	return check;
}