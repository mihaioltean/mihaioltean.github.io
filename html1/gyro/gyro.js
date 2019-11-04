document.getElementById("id_logic_version").innerHTML="Logic = 2019.11.4.0";

window.addEventListener("deviceorientation", on_gyro_data_uab); 

function on_gyro_data_uab(e)
{
	document.getElementById("id_alpha").innerHTML = e.alpha;
	document.getElementById("id_beta").innerHTML = e.beta;
	document.getElementById("id_gamma").innerHTML = e.gamma;
}