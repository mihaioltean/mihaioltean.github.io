document.getElementById("id_logic_version").innerHTML = "Logic version: 2018.12.10.1";
document.getElementById("id_start").addEventListener("click", start_listen);

var reco = new webkitSpeechRecognition();
reco.lang = "en-US";
reco.onresult = on_speech_results;
reco.onspeechend = on_speech_end;
//--------------------------
function start_listen()
{
	reco.start();
}
//--------------------------
function on_speech_end()
{
	reco.stop();
}
//--------------------------
function on_speech_results(e)
{
		document.getElementById("id_text").innerHTML = 
			e.results[0][0].transcript + "(" + e.results[0][0].confidence + ")";
}