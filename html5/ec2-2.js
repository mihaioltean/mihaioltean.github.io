 document.getElementById("id_bussiness_version").innerHTML = "Bussiness version: 2018.10.22.0";
 document.getElementById("id_button").addEventListener("click", rezolva);
 
 //----------------------------------
 function t_ec2()
 {
	 this.citire = function()
	 {
		this.a = document.getElementById("id_a").value; 
		this.b = document.getElementById("id_b").value;
		this.c = document.getElementById("id_c").value;		
	 }
	 //----------------------------------
	 this.rezolvare = function()
	 {
		var delta = this.b * this.b - 4 * this.a * this.c;
		var x1_re, x2_re, x1_im, x2_im;
			
		if (delta >= 0){
			x1_re = (-this.b + Math.sqrt(delta)) / (2 * this.a);
			x2_re = (-this.b - Math.sqrt(delta)) / (2 * this.a);
			x1_im = x2_im = 0;
		}
		else{
			x1_re = -this.b / (2 * this.a);
			x1_im = Math.sqrt(-delta) / (2 * this.a);
			x2_re = -this.b / (2 * this.a);
			x2_im = -Math.sqrt(-delta) / (2 * this.a);
		}
		
		this.x1 = {re: x1_re, im: x1_im};
		this.x2 = {re: x2_re, im: x2_im};
	 }
	 //----------------------------------
	 this.afisare = function()
	 {
		document.getElementById("id_x1").innerHTML = "x1 = " + this.x1.re + " + " + this.x1.im + "i";
		document.getElementById("id_x2").innerHTML = "x2 = " + this.x2.re + " + " + this.x2.im + "i";
	 }
 }
 //----------------------------------
 function rezolva()
 {
	 var ec2 = new t_ec2();
	 ec2.citire();
	 ec2.rezolvare();
	 ec2.afisare();
 }
 //----------------------------------