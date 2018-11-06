document.getElementById("id_logic_version").innerHTML = "Logic version: 2018.11.06.2";

window.addEventListener("deviceorientation", la_schimbare_gyro);
window.addEventListener("devicemotion", la_schimbare_acc);
//--------------------------------------------
function la_schimbare_acc(e)
{
  document.getElementById("id_acc_x").innerHTML = e.accelerationIncludingGravity.x;
  document.getElementById("id_acc_y").innerHTML = e.accelerationIncludingGravity.y;
  document.getElementById("id_acc_z").innerHTML = e.accelerationIncludingGravity.z;
}
//--------------------------------------------
function la_schimbare_gyro(e)
{
  document.getElementById("id_x").innerHTML = e.beta;
  document.getElementById("id_y").innerHTML = e.gamma;
  document.getElementById("id_z").innerHTML = e.alpha;
  
  var canvas = document.getElementById("id_canvas");
  var context = canvas.getContext("2d");
  
  var R = 10;
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  context.beginPath();
  context.arc(canvas.width / 2 + e.gamma / 90 * (canvas.width / 2 - R), 
              canvas.height / 2 + e.beta / 90 * (canvas.height / 2 - R), 
              R, 0, 2 * Math.PI);
  context.stroke();
}
