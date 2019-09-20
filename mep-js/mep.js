//---------------------------------------------------------------------------
//	Multi Expression Programming - basic source code for solving symbolic regression and binary classification problems
//	Author: Mihai Oltean, mihai.oltean@gmail.com
//	www.mepx.org
//	Last update on: 2019.09.15

//	License: MIT
//---------------------------------------------------------------------------

//   More info at:  
//     www.mepx.org
//     www.github.com/mepx

//   Please reports any sugestions and/or bugs to mihai.oltean@gmail.com

//   Training data file must have the following format (see building1.txt and cancer1.txt):
//   building1 and cancer1 data were taken from PROBEN1

//   x11 x12 ... x1n f1
//   x21 x22 ....x2n f2
//   .............
//   xm1 xm2 ... xmn fm

//   where m is the number of training data
//   and n is the number of variables.
//   xij are the inputs
//   fi are the outputs


var num_operators = 4;

// +   -1
// -   -2
// *   -3
// /   -4

var operators_string = "+-*/";

var num_training_data, num_variables;
var training_data = [];
var target = [];
var file_content_display_area = document.getElementById('id_fileDisplayArea');
var params = {};


//---------------------------------------------------------------------------
function allocate_chromosome(params)
{
	var program = {}; 
	program.code = new Array(params.code_length);
	if (params.num_constants)
		program.constants = new Float32Array(params.num_constants);
	else
		program.constants = [];
	return program;
}
//---------------------------------------------------------------------------
function delete_chromosome(program)
{
	program.code.length = 0;
	program.constants.length = 0;
}
//---------------------------------------------------------------------------
function allocate_training_data(num_training_data, num_variables)
{
	var data = new Array(num_training_data);
	for (var i = 0; i < num_training_data; i++)
		data[i] = new Float32Array(num_variables);
	return data;
}
//---------------------------------------------------------------------------
function allocate_target_data(num_training_data)
{
	data = new Float32Array(num_training_data);
	return data;
}
//---------------------------------------------------------------------------
function allocate_partial_expression_values(num_training_data, code_length)
{
	var expression_value = new Array(code_length);
	for (var i = 0; i < code_length; i++)
		expression_value[i] = new Float32Array(num_training_data);
	return expression_value;
}
//---------------------------------------------------------------------------
function delete_partial_expression_values(expression_value, code_length)
{
	for (var i = 0; i < code_length; i++)
		expression_value[i].length = 0;
	expression_value.length = 0;
}
//---------------------------------------------------------------------------
function delete_data(data, target, num_training_data)
{
	for (var i = 0; i < num_training_data; i++)
		data[i].length = 0;
	data.length = 0;
	target.length = 0;
}
//---------------------------------------------------------------------------
function copy_individual(dest, source, params)
{
	for (var i = 0; i < params.code_length; i++)
		dest.code[i] = source.code[i];
	for (var i = 0; i < params.num_constants; i++)
		dest.constants[i] = source.constants[i];
	dest.fitness = source.fitness;
	dest.best_index = source.best_index;
}
//---------------------------------------------------------------------------
function generate_random_chromosome(params, num_variables) // randomly initializes the individuals
{
	// generate constants first
	var program = {};
	program.constants = [];
	for (var c = 0; c < params.num_constants; c++)
		program.constants.push(Math.floor(Math.random() * (params.constants_max - params.constants_min) + params.constants_min));

	// on the first position we can have only a variable or a constant
	var sum = params.variables_probability + params.constants_probability;
	var p = Math.random() * sum;

	program.code = [];
	if (p <= params.variables_probability){
		program.code[0] = {};
		program.code[0].op = Math.floor(Math.random() * num_variables);
	}
	else{
		program.code[0] = {};
		program.code[0].op = num_variables + Math.floor(Math.random() * params.num_constants);
	}

	// for all other genes we put either an operator, variable or constant
	for (var i = 1; i < params.code_length; i++) {
		var p = Math.random();

		if (p <= params.operators_probability){
			program.code[i] = {};
			program.code[i].op = -Math.floor(Math.random() * num_operators) - 1;        // an operator
		}
		else
			if (p <= params.operators_probability + params.variables_probability){
				program.code[i] = {};
				program.code[i].op = Math.floor(Math.random() * num_variables);     // a variable
			}
			else{
				program.code[i] = {};
				program.code[i].op = num_variables + Math.floor(Math.random() * params.num_constants); // index of a constant
			}

		program.code[i].addr1 = Math.floor(Math.random() * i);
		program.code[i].addr2 = Math.floor(Math.random() * i);
	}
	return program;
}
//---------------------------------------------------------------------------
function compute_eval_matrix(program, code_length, num_variables, num_training_data, training_data, eval_matrix)
{
	// we keep intermediate values in a matrix because when an error occurs (like division by 0) we mutate that gene into a variables.
	// in such case it is faster to have all intermediate results until current gene, so that we don't have to recompute them again.

	var is_error_case;  // division by zero, other errors


	for (var i = 0; i < code_length; i++){   // read the chromosome from top to down
		is_error_case = false;
		switch (program.code[i].op) {

		case  -1:  // +
			for (var k = 0; k < num_training_data; k++)
				eval_matrix[i][k] = eval_matrix[program.code[i].addr1][k] + eval_matrix[program.code[i].addr2][k];
			break;
		case  -2:  // -
			for (var k = 0; k < num_training_data; k++)
				eval_matrix[i][k] = eval_matrix[program.code[i].addr1][k] - eval_matrix[program.code[i].addr2][k];

			break;
		case  -3:  // *
			for (var k = 0; k < num_training_data; k++)
				eval_matrix[i][k] = eval_matrix[program.code[i].addr1][k] * eval_matrix[program.code[i].addr2][k];
			break;
		case  -4:  //  /
			for (var k = 0; k < num_training_data; k++)
				if (Math.abs(eval_matrix[program.code[i].addr2][k]) < 1e-6) // a small constant
					is_error_case = true;
			if (is_error_case) {                                           // an division by zero error occured !!!
				program.code[i].op = Math.floor(Math.random() * num_variables);   // the gene is mutated into a terminal
				for (var k = 0; k < num_training_data; k++)
					eval_matrix[i][k] = training_data[k][program.code[i].op];
			}
			else    // normal execution....
				for (var k = 0; k < num_training_data; k++)
					eval_matrix[i][k] = eval_matrix[program.code[i].addr1][k] / eval_matrix[program.code[i].addr2][k];
			break;
		default:  // a variable
			for (var k = 0; k < num_training_data; k++)
				if (program.code[i].op < num_variables)
					eval_matrix[i][k] = training_data[k][program.code[i].op];
				else
					eval_matrix[i][k] = program.constants[program.code[i].op - num_variables];
			break;
		}
	}
}
//---------------------------------------------------------------------------
function fitness_regression(program, code_length, num_variables, num_training_data, training_data, target, eval_matrix)
{
	program.fitness = 1e+308;
	program.best_index = -1;

	compute_eval_matrix(program, code_length, num_variables, num_training_data, training_data, eval_matrix);

	for (var i = 0; i < code_length; i++) {   // read the chromosome from top to down
		var sum_of_errors = 0;
		for (var k = 0; k < num_training_data; k++)
			sum_of_errors += Math.abs(eval_matrix[i][k] - target[k]);// difference between obtained and expected

		if (program.fitness > sum_of_errors) {
			program.fitness = sum_of_errors;
			program.best_index = i;
		}
	}
}
//---------------------------------------------------------------------------
function fitness_classification(program, code_length, num_variables, num_training_data, training_data, target, eval_matrix)
{
	program.fitness = 1e+308;
	program.best_index = -1;

	compute_eval_matrix(c, code_length, num_variables, num_training_data, training_data, eval_matrix);

	for (var i = 0; i < code_length; i++) {   // read the chromosome from top to down
		var count_incorrect_classified = 0;
		for (var k = 0; k < num_training_data; k++)
			if (eval_matrix[i][k] < 0) // the program tells me that this data is in class 0
				count_incorrect_classified += target[k];
			else // the program tells me that this data is in class 1
				count_incorrect_classified += Math.abs(1 - target[k]);// difference between obtained and expected

		if (program.fitness > count_incorrect_classified) {
			program.fitness = count_incorrect_classified;
			program.best_index = i;
		}
	}
}
//---------------------------------------------------------------------------

function mutation(program, params, num_variables) // mutate the individual
{
	// mutate each symbol with the given probability
	// first gene must be a variable or constant
	var p = Math.random();
	if (p < params.mutation_probability) {
		var sum = params.variables_probability + params.constants_probability;
		var p = Math.random() * sum;

		if (p <= params.variables_probability)
			program.code[0].op = Math.floor(Math.random() * num_variables);
		else
			program.code[0].op = num_variables + Math.floor(Math.random() * params.num_constants);
	}
	// other genes
	for (var i = 1; i < params.code_length; i++) {
		p = Math.random();      // mutate the operator
		if (p < params.mutation_probability) {
			// we mutate it, but we have to decide what we put here
			p = Math.random();

			if (p <= params.operators_probability)
				program.code[i].op = -Math.floor(Math.random() * num_operators) - 1;
			else
				if (p <= params.operators_probability + params.variables_probability)
					program.code[i].op = Math.floor(Math.random() * num_variables);
				else
					program.code[i].op = num_variables + Math.floor(Math.random() * params.num_constants); // index of a constant
		}

		p = Math.random();      // mutate the first address  (addr1)
		if (p < params.mutation_probability)
			program.code[i].addr1 = Math.floor(Math.random() * i);

		p = Math.random();      // mutate the second address   (addr2)
		if (p < params.mutation_probability)
			program.code[i].addr2 = Math.floor(Math.random() * i);
	}
	// mutate the constants
	for (var c = 0; c < params.num_constants; c++) {
		p = Math.random();
		if (p < params.mutation_probability)
			program.constants[c] = Math.random() * (params.constants_max - params.constants_min) + params.constants_min;
	}

}
//---------------------------------------------------------------------------
function uniform_crossover(parent1, parent2, params, offspring1, offspring2)
{
	for (var i = 0; i < params.code_length; i++)
		if (Math.random() < 0.5) {
			offspring1.code[i] = parent1.code[i];
			offspring2.code[i] = parent2.code[i];
		}
		else {
			offspring1.code[i] = parent2.code[i];
			offspring2.code[i] = parent1.code[i];
		}

	// constants
	for (var i = 0; i < params.num_constants; i++)
		if (Math.random() < 0.5) {
			offspring1.constants[i] = parent1.constants[i];
			offspring2.constants[i] = parent2.constants[i];
		}
		else {
			offspring1.constants[i] = parent2.constants[i];
			offspring2.constants[i] = parent1.constants[i];
		}
}
//---------------------------------------------------------------------------

function sort_function(a, b)
{// comparator for quick sort
	if (a.fitness > b.fitness)
		return 1;
	else
		if (a.fitness < b.fitness)
			return -1;
		else
			return 0;
}
//---------------------------------------------------------------------------
function print_chromosome(program, params, num_variables)
{
	console.log("The chromosome is:\n");

	//for (var i = 0; i < params.num_constants; i++)
		console.log(program.constants);
	console.log(program.code);
/*
	for (var i = 0; i < params.code_length; i++)
		if (program.code[i].op < 0)
			console.log("%d: %c %d %d\n", i, operators_string[abs(program.code[i].op) - 1], program.code[i].addr1, program.code[i].addr2);
		else
			if (program.code[i].op < num_variables)
				console.log("%d: inputs[%d]\n", i, program.code[i].op);
			else
				console.log("%d: constants[%d]\n", i, program.code[i].op - num_variables);
*/
	console.log("best index = " + program.best_index);
	console.log("Fitness = " + program.fitness);
}
//---------------------------------------------------------------------------
function tournament_selection(population, pop_size, tournament_size)     // Size is the size of the tournament
{
	var r, p;
	p = Math.floor(Math.random() * pop_size);
	for (var i = 1; i < tournament_size; i++) {
		r = Math.floor(Math.random() * pop_size);
		p = population[r].fitness < population[p].fitness ? r : p;
	}
	return p;
}
//---------------------------------------------------------------------------
function start_steady_state_mep(params, training_data, target, num_training_data, num_variables)       // Steady-State 
{
	// a steady state approach:
	// we work with 1 population
	// newly created individuals will replace the worst existing ones (only if they are better).

	// allocate memory
	population = new Array(params.pop_size);
//	for (var i = 0; i < params.pop_size; i++)
//		population[i] = allocate_chromosome(params);

	var offspring1 = allocate_chromosome(params);
	var offspring2 = allocate_chromosome(params);

	var eval_matrix = allocate_partial_expression_values(num_training_data, params.code_length);

	// initialize
	for (var i = 0; i < params.pop_size; i++) {
		population[i] = generate_random_chromosome(params, num_variables);
		if (params.problem_type == 0)
			fitness_regression(population[i], params.code_length, num_variables, num_training_data, training_data, target, eval_matrix);
		else
			fitness_classification(population[i], params.code_length, num_variables, num_training_data, training_data, target, eval_matrix);

	}
	// sort ascendingly by fitness
	population.sort(sort_function);

	console.log("generation = 0 " + " best error = " + population[0].fitness);

	for (var g = 1; g < params.num_generations; g++) {// for each generation
		for (var k = 0; k < params.pop_size; k += 2) {
			// choose the parents using binary tournament
			var r1 = tournament_selection(population, params.pop_size, 2);
			var r2 = tournament_selection(population, params.pop_size, 2);
			// crossover
			var p = Math.random();
			if (p < params.crossover_probability)
				uniform_crossover(population[r1], population[r2], params, offspring1, offspring2);
			else {// no crossover so the offspring are a copy of the parents
				copy_individual(offspring1, population[r1], params);
				copy_individual(offspring2, population[r2], params);
			}
			// mutate the result and compute fitness
			mutation(offspring1, params, num_variables);
			if (params.problem_type == 0)
				fitness_regression(offspring1, params.code_length, num_variables, num_training_data, training_data, target, eval_matrix);
			else
				fitness_classification(offspring1, params.code_length, num_variables, num_training_data, training_data, target, eval_matrix);
			// mutate the other offspring and compute fitness
			mutation(offspring2, params, num_variables);
			if (params.problem_type == 0)
				fitness_regression(offspring2, params.code_length, num_variables, num_training_data, training_data, target, eval_matrix);
			else
				fitness_classification(offspring2, params.code_length, num_variables, num_training_data, training_data, target, eval_matrix);

			// replace the worst in the population
			if (offspring1.fitness < population[params.pop_size - 1].fitness) {
				copy_individual(population[params.pop_size - 1], offspring1, params);
				population.sort(sort_function);
			}
			if (offspring2.fitness < population[params.pop_size - 1].fitness) {
				copy_individual(population[params.pop_size - 1], offspring2, params);
				population.sort(sort_function);
			}
		}
		console.log("generation = " + g + ", best error = " + population[0].fitness);
	}
	// print best chromosome
	print_chromosome(population[0], params, num_variables);
	document.getElementById("id_generation").innerHTML = "Generation = " + params.num_generations;
	document.getElementById("id_error").innerHTML = "Best error = " + population[0].fitness;
	
	// free memory
	delete_chromosome(offspring1);
	delete_chromosome(offspring2);

	for (var i = 0; i < params.pop_size; i++)
		delete_chromosome(population[i]);
	population.length = 0;

	delete_partial_expression_values(eval_matrix, params.code_length);
}
//--------------------------------------------------------------------
function read_file(file_name)
{
	return new Promise((resolve, reject) => {
		var fr = new FileReader();  
		fr.onload = function(e){
			var all_text_lines = e.target.result.split(/\r\n|\n/);
			num_training_data = all_text_lines.length;
			var first_line = all_text_lines[0].split(' ');
			num_variables = first_line.length - 1;
			
			training_data = allocate_training_data(num_training_data, num_variables);
			target = allocate_target_data(num_training_data);

			for (var i = 0; i < all_text_lines.length; i++) {
				var row_data = all_text_lines[i].split(' ');
				for (var j = 0; j < row_data.length - 1; j++) 
					training_data[i][j] = row_data[j];
				target[i] = row_data[row_data.length - 1];
			}
			resolve("ok");
		}
		fr.readAsText(file_name);
	});
}
//--------------------------------------------------------------------
function on_read_data()
{
	var then = new Date().getTime();
	
	start_steady_state_mep(params, training_data, target, num_training_data, num_variables);	
	
	var now = new Date().getTime();
	var miliseconds = now - then;
	console.log("Running time = " + miliseconds / 1000 + " seconds");
	document.getElementById("id_running_time").innerHTML = "Running time = " + miliseconds / 1000 + " seconds";
}
//---------------------------------------------------------------------------
function start_mep()
{
	params.pop_size = 100;		// the number of individuals in population  (must be an even number!)
	params.code_length = 50;
	params.num_generations = 10;					// the number of generations
	params.mutation_probability = 0.1;              // mutation probability
	params.crossover_probability = 0.9;             // crossover probability

	params.variables_probability = 0.4;
	params.operators_probability = 0.5;
	params.constants_probability = 1 - params.variables_probability - params.operators_probability; // sum of variables_prob + operators_prob + constants_prob MUST BE 1 !

	params.num_constants = 3; // use 3 constants from -1 ... +1 interval
	params.constants_min = -1;
	params.constants_max = 1;

	params.problem_type = 0;             //0 - regression, 1 - classification; DONT FORGET TO SET IT
	params.classification_threshold = 0; // only for classification problems
	
	var input_file = document.getElementById('id_data_file');

	var file_name = input_file.files[0];
	var textType = /text.*/;

	if (file_name.type.match(textType)) {
		read_file(file_name).then(on_read_data, ()=>{});    
	}
		
	//srand(0);
	
	delete_data(training_data, target, num_training_data);

	console.log("Done ...");
}
//--------------------------------------------------------------------