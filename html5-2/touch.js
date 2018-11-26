document.getElementById("id_logic_version").innerHTML = "Logic version: 2018.11.26.1";
var canvas = document.getElementById("id_canvas");
canvas.addEventListener("touchstart", on_touch_start);
var canvas_bounding_rect = canvas.getBoundingClientRect();

//------------------------------------
function on_touch_start(e)
{
	for (var i = 0; i < e.changedTouches.length; i++){
		var context = canvas.getContext("2d");
		context.beginPath();
		context.arc(e.changedTouches[i].pageX - canvas_bounding_rect.left,
					e.changedTouches[i].pageY - canvas_bounding_rect.top,
					10,
					0, 2 * Math.PI);
		context.stroke();
	}
}
//------------------------------------