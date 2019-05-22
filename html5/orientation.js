document.getElementById("id_bussiness_version").innerHTML = "Bussiness version: 2019.05.22.0";

window.addEventListener("deviceorientation", on_device_orientation);
window.addEventListener("devicemotion", on_device_motion);

//------------------------------------------------------
function on_device_orientation(e)
{
	// please note that some devices do not have gyroscope so these data are not displayed
	document.getElementById("id_alpha").innerHTML = "Alpha (Z) = " + e.alpha;
	document.getElementById("id_beta").innerHTML = "Beta (Y) = " + e.beta;
	document.getElementById("id_gamma").innerHTML = "Gamma (X) = " + e.gamma;
	
	var canvas = document.getElementById("id_canvas");
	var context = canvas.getContext("2d");
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	var R = 10;
	context.beginPath();
	context.arc(canvas.width / 2 + e.gamma / 90 * (canvas.width / 2 - R), 
				canvas.height / 2 + e.beta / 90 * (canvas.height / 2 - R), 
				R, 
				0, 2 * Math.PI);
	context.stroke();
}
//------------------------------------------------------
function on_device_motion(e)
{
	var acc_z = e.accelerationIncludingGravity.z;
	var acc_x = e.accelerationIncludingGravity.x;
	var acc_y = e.accelerationIncludingGravity.y;
	
	document.getElementById("id_acc_z").innerHTML = "Z = " + Math.round(acc_z * 100) / 100;
	document.getElementById("id_acc_x").innerHTML = "X = " + Math.round(acc_x * 100) / 100 ;
	document.getElementById("id_acc_y").innerHTML = "Y = " + Math.round(acc_y * 100) / 100;
	
	document.getElementById("id_rot_x").innerHTML = "X (gamma) = " + -Math.atan(acc_x / acc_z) * 180 / Math.PI;
	document.getElementById("id_rot_y").innerHTML = "Y (beta) = " + Math.atan(acc_y / acc_z) * 180 / Math.PI;
}
//------------------------------------------------------
