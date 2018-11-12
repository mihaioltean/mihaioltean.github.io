
function f(resolve, reject)
{
	//... facem multe operatii
	resolve(":)");
	
	// reject("(:");
}
//--------------------------------
function on_success(e)
{
	console.log("Success:" + e);
}
//--------------------------------
function on_failure(e)
{
	console.log("Failure:" + e);
}
//--------------------------------
function start()
{
	console.log("Before promise is created");
	var promise = new Promise(f);
	
	promise.then(on_success, on_failure);
	console.log("End of start function");
}
//--------------------------------