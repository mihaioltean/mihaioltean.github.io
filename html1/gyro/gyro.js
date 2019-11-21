document.getElementById("id_logic_version").innerHTML = "Logic = 2019.11.4.4";

window.addEventListener("deviceorientation", on_gyro_data_uab); 
window.addEventListener("devicemotion", on_acc_data_uab); 

function deseneaza(unghi_x, unghi_y)
{
	// obtinem context grafic
	var canvas = document.getElementById("id_canvas");
	var context = canvas.getContext("2d");
	var r = 10;
	context.clearRect(0, 0, canvas.width, canvas.height);
	// construim o cale
	context.beginPath();
	// adaugam un cerc la cale
	var x = unghi_x / 90 * (canvas.width / 2 - r) + canvas.width / 2;
	var y = unghi_y / 90 * (canvas.height / 2 - r) + canvas.height / 2;
	context.arc(x, y, r, 0, 2 * Math.PI);
	// desenam calea
	context.stroke();
}

function on_gyro_data_uab(e)
{
	document.getElementById("id_alpha").innerHTML = Math.round(e.alpha * 100) / 100;
	document.getElementById("id_beta").innerHTML = Math.round(e.beta * 100) / 100;
	document.getElementById("id_gamma").innerHTML = Math.round(e.gamma * 100) / 100;
	
	deseneaza(e.beta, e.gamma);
}

function on_acc_data_uab(e)
{
	var acc = e.accelerationIncludingGravity;
	
	document.getElementById("id_acc_x").innerHTML = Math.round(acc.x * 100)/100;
	document.getElementById("id_acc_y").innerHTML = Math.round(acc.y * 100)/100;
	document.getElementById("id_acc_z").innerHTML = Math.round(acc.z * 100)/100;
	
	var rot_x = Math.atan(acc.x / acc.z) * 180 / Math.PI;
	var rot_y = Math.atan(acc.y / acc.z) * 180 / Math.PI;
	
	document.getElementById("id_rot_x").innerHTML = Math.round(rot_x*100)/100;
	document.getElementById("id_rot_y").innerHTML = Math.round(rot_y*100)/100;
	
}