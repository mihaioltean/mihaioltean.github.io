document.getElementById("id_logic_version").innerHTML = "Logic version 2019.10.14.1";

document.getElementById("id_button").addEventListener("click", solve_eq2);

function solve_eq2()
{
	// citire
	var a = document.getElementById("id_a").value;
	var b = document.getElementById("id_b").value;
	var c = document.getElementById("id_c").value;
	
	// calcul
	var delta = b * b - 4 * a * c;
	var x1_re, x1_im, x2_re, x2_im;
	
	if (delta >= 0){
		x1_re = (-b - Math.sqrt(delta)) / (2 * a);
		x2_re = (-b + Math.sqrt(delta)) / (2 * a);
		x1_im = 0;
		x2_im = 0;
	}
	else{
		x1_re = (-b) / (2 * a);
		x2_re = (-b) / (2 * a);
		x1_im =  - Math.sqrt(-delta) / (2 * a);
		x2_im =  + Math.sqrt(-delta) / (2 * a);	
	}
	
	// afisare
	document.getElementById("id_x1").innerHTML = "X1 = " + x1_re + "+" + x1_im + "i";
	document.getElementById("id_x2").innerHTML = "X2 = " + x2_re + "+" + x2_im + "i";
}