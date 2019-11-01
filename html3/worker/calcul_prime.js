function este_prim(n)
{
	for (var i = 2; i * i <= n; i++)
		if (n % i == 0)
			return true;
	return false;	
}

for (var i = 1E9; i < 1E10; i++)
	if (este_prim(i)){
		postMessage(i);
	}