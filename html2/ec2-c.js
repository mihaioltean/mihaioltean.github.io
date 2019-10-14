document.getElementById("id_logic_version").innerHTML = "Logic version 2019.10.14.1";

document.getElementById("id_button").addEventListener("click", solve_eq2);

class t_eq2
{
	a;
	b;
	c;
	x1_re;
	x1_im;
	x2_re;
	x2_im;
	
	read_coefficients()
	{
		// citire
		this.a = document.getElementById("id_a").value;
		this.b = document.getElementById("id_b").value;
		this.c = document.getElementById("id_c").value;	
	}

	compute_solutions()
	{
		// calcul
		var delta = this.b * this.b - 4 * this.a * this.c;
		
		if (delta >= 0){
			this.x1_re = (-this.b - Math.sqrt(delta)) / (2 * this.a);
			this.x2_re = (-this.b + Math.sqrt(delta)) / (2 * this.a);
			this.x1_im = 0;
			this.x2_im = 0;
		}
		else{
			this.x1_re = (-this.b) / (2 * this.a);
			this.x2_re = (-this.b) / (2 * this.a);
			this.x1_im =  - Math.sqrt(-delta) / (2 * this.a);
			this.x2_im =  + Math.sqrt(-delta) / (2 * this.a);	
		}
	}

	print_solutions()
	{
		// afisare
		document.getElementById("id_x1").innerHTML = "X1 = " + this.x1_re + "+" + this.x1_im + "i";
		document.getElementById("id_x2").innerHTML = "X2 = " + this.x2_re + "+" + this.x2_im + "i";	
	}
}
//------------------------------------------
function solve_eq2()
{
	var ec2 = new t_eq2();
	ec2.read_coefficients();
	ec2.compute_solutions();
	ec2.print_solutions();
}