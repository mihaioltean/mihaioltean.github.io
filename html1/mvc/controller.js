class t_eq2_controller{
	view;
	model;
	
	constructor(view, model)
	{
		this.view = view;
		this.model = model;
		
		// construim o lista de evenimente care au atasate functii ascultatoare
		var events = new t_events();
		// adaugam on_solve (metoda controllerului) in lista
		events.add_event("solve_clicked_uab", this.on_solve.bind(this));
		// trasmitem lista la view
		this.view.set_events_list(events);
	}
	
	on_solve()
	{
		var a = this.view.get_a();
		var b = this.view.get_b();
		var c = this.view.get_c();
		
		this.model.set_coefficients(a, b, c);
		this.model.solve();
		var solutions = this.model.get_solutions();
		
		this.view.set_solutions_para(solutions);
	}
}

const app = new t_eq2_controller(new t_eq2_view(), new t_eq2_model());

