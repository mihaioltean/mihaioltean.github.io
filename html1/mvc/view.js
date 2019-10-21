class t_eq2_view{
	events;
	constructor()
	{
		document.getElementById("id_button").addEventListener("click", this.on_solve_click);
	}
	
	set_events_list(events)
	{
		this.events = events;
	}
	
	on_solve_click()
	{
		//ar trebui sa apelam metoda on_solve din controller ... dar nu putem direct
		// generam un eveniment care apeleaza metoda on_solve stocata in lista
		events.call_event("solve_clicked_uab");
	}
	
	get_a()
	{
		return document.getElementById("id_a").value;
	}
	get_b()
	{
		return document.getElementById("id_b").value;		
	}
	get_c()
	{
		return document.getElementById("id_c").value;
	}
	set_solutions_para(solutions)
	{
		document.getElementById("id_x1").innerHTML = "x1 = " + solutions.x1_re + "+" + solutions.x1_im + "i";
		document.getElementById("id_x2").innerHTML = "x2 = " + solutions.x2_re + "+" + solutions.x2_im + "i";
	}
}