document.getElementById("id_logic_version").innerHTML = "Logic version: 2018.12.10.1";
document.getElementById("id_get_voices").addEventListener("click", get_voices);
document.getElementById("id_start").addEventListener("click", speak);

var synth = window.speechSynthesis;

//-------------------------------------------
function get_voices()
{
	var voices = synth.getVoices();
	var voices_list = document.getElementById("id_voices_list");
	for (var i = 0; i < voices.length; i++)
		voices_list.innerHTML += voices[i].lang + " " + voices[i].name + "<br>";
}
//-------------------------------------------
function speak()
{
	var utterance = new SpeechSynthesisUtterance();
	utterance.lang = "en-US";
	utterance.text = document.getElementById("id_text").value;
	utterance.onend = on_end_speech;
	document.getElementById("id_start").disabled = true;	

	synth.speak(utterance);
}
//-------------------------------------------
function on_end_speech()
{
	document.getElementById("id_start").disabled = false;
}