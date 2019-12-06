document.getElementById("id_logic_version").innerHTML = "Logic version = 2019.12.06.0";
document.getElementById("id_button").addEventListener("click", on_cere_permisiuni);

if (typeof(DeviceOrientationEvent.requestPermission) == "function"){
}
else
	window.addEventListener("deviceorientation", on_orientation_uab);

window.addEventListener("devicemotion", on_motion_uab);

function f_ok(p)
{
	if (p == "granted")
		window.addEventListener("deviceorientation", on_orientation_uab);
	else
		alert("Permisiune respinsa");
}

function f_not_ok(p)
{
	alert("Promisiune respinsa");
}

function on_cere_permisiuni()
{
	DeviceOrientationEvent.requestPermission().then(f_ok).catch(f_not_ok);
}

function desenare(beta, gamma)
{
	var svg = document.getElementById("id_svg");
	var cerc = document.getElementById("id_circle");
		
	var r = cerc.getAttribute("r");
	var svg_height = svg.getAttribute("height");
	var svg_width = svg.getAttribute("width");
	
	var x = svg_width / 2 + beta / 90 * (svg_width / 2 - r);
	var y = svg_height / 2 + gamma / 90 * (svg_height / 2 - r);
	
	cerc.setAttribute("cx", x);
	cerc.setAttribute("cy", y);
}

function on_orientation_uab(e)
{
	desenare(e.beta, e.gamma);
}

function on_motion_uab(e)
{
	var acc = e.accelerationIncludingGravity;
		
	var beta = -Math.atan(acc.y / acc.z) / Math.PI * 180;
	var gamma = Math.atan(acc.x / acc.z) / Math.PI * 180;
		
	//desenare(beta, gamma);
}
