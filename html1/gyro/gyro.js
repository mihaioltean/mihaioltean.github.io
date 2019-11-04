document.getElementById("id_logic_version").innerHTML="Logic = 2019.11.4.1";

window.addEventListener("deviceorientation", on_gyro_data_uab); 

function on_gyro_data_uab(e)
{
	document.getElementById("id_alpha").innerHTML = Math.round(e.alpha * 100) / 100;
	document.getElementById("id_beta").innerHTML = Math.round(e.beta * 100) / 100;
	document.getElementById("id_gamma").innerHTML = Math.round(e.gamma * 100) / 100;
}