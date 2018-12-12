document.getElementById("id_logic_version").innerHTML = "Logic version=2018.12.10.0";
document.getElementById("id_get_voices").addEventListener("click", on_get_voices);
document.getElementById("id_speak").addEventListener("click", on_speak);

var synth = window.speechSynthesis;

function on_get_voices()
{
	document.getElementById("id_voices_list").innerHTML = "";
	var voices = synth.getVoices();
	for (var i = 0; i < voices.length; i++)
		document.getElementById("id_voices_list").innerHTML +=
			voices[i].lang + " " + voices[i].name + "<br>";
}

function on_speak()
{
	var enunt = new SpeechSynthesisUtterance ();
	enunt.lang = "en-US";
	enunt.text = document.getElementById("id_text").value;
	enunt.onend = on_end_speech;
	
	document.getElementById("id_speak").disabled = true;
	
	synth.speak(enunt);
}

function on_end_speech()
{
	document.getElementById("id_speak").disabled = false;
}