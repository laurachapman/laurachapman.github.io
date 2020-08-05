

borda_info_intro = "The <a href='https://en.wikipedia.org/wiki/Borda_count'>Borda method</a> calculates each dish's points by summing up for each vote the number of dishes" +
	" minus the ranking over the number of candidates. So the dish in first place gets 12/13 points and the dish in last " +
	"place gets 1/13 points. Borda count is intended to select a broadly popular choice that is acceptable " +
	"to the most people but isn't necessarily the majority first choice. ";
borda_info = borda_info_intro + "<br><br>Formula: score = sum((#candidates - ranking)/#candidates)";
borda_normalized_info = borda_info_intro + " In the normalized varient of Borda, the sum of points is divided by the " +
	"number of total votes cast for that dish. This neutralizes the effects of certain dishes getting fewer votes" +
	" due to being added later. <br><br>Formula: score = (sum((#candidates - ranking)/#candidates))/number of votes";

dowdall_info_intro = "The <a href='https://en.wikipedia.org/wiki/Borda_count#Dowdall_system_(Nauru)'>Dowdall method</a> is a variant of Borda that calculates each dish's points by summing up for each vote the reciprocal of " +
	"the ranking. So the dish in first place gets 1 point, the dish in second place gets 1/2 a point, and so on. " +
	"The Dowdall method gives more of an advantage to first-choice votes than normal Borda, so it " +
	"is sort of a compromise between Borda and single-choice voting.";
dowdall_info = dowdall_info_intro + "<br><br>Formula: score = sum(1/ranking)";
dowdall_normalized_info = dowdall_info_intro + " In the normalized varient of Dowdall, the sum of points is divided by the " +
    "number of total votes cast for that dish. This neutralizes the effects of certain dishes getting fewer votes" +
    "due to being added later. <br><br>Formula: score = (sum(1/ranking))/number of votes";

condorcet_info = "The <a href='https://en.wikipedia.org/wiki/Condorcet_method'>Condorcet method</a> considers which dishes would " +
	"win the most one-to-one face offs in which the winner is the dish preferred by more students. " +
	"It is designed to select a dish that is broadly favorable but not necessarily the majority top pick. " +
	"Two dishes received zero points using the Condorcet method. " +
	"The Condorcet method harshly penalizes dishes with fewer votes because it considers a lack of a " +
	"vote a low ranking. It also doesn't consider information about the absolute " +
	"rankings of dishes, only the relative rankings. <br><br>Formula: score = sum(number of one-v-one preference wins)";

method_to_text = {
	"borna": borda_info,
	"borda_normalized": borda_normalized_info,
	"dowall": dowdall_info,
	"dowall_normalized": dowdall_normalized_info,
	"condorcet_count": condorcet_info
}

function convert_to_num(n){
	if (isNaN(n)){
		return 0;
	}
	else{
		return +n;
	}
}

function return_array(str){
	var arr = str.split("-")
	for(var i=0; i<arr.length; i=i+1){
		arr[i] = +arr[i]
	}
	return arr
}

queue()
	.defer(d3.csv, "chicken_data/summary_data.csv")
	.defer(d3.csv, "chicken_data/vote_data.csv")
	.await(createVis)

function createVis(error, data, votedata){
	if(error) { console.log(error); }

	votedata.forEach(function(d){
		d.votes = return_array(d.votes)
	})

	data.forEach(function(d){
		d.borda_normalized = convert_to_num(d.borda_normalized);
		d.borna = convert_to_num(d.borna);
		d.condorcet_count = convert_to_num(d.condorcet_count);
		d.dowall = convert_to_num(d.dowall);
		d.dowall_normalized = convert_to_num(d.dowall_normalized);
		d.num_votes = convert_to_num(d.num_votes);
	});

	// here: create a stacked bar chart with votedata

	stackedbar = new StackedBarChart("stacked_chart", "stacked_chart-legend", votedata, 500, 700);

	//make a legend for the barchart

	barchart = new BarChart("barcharts", data, 500, 700, stackedbar.z)

    selectedOption = d3.select("#vote-method").property("value");
    document.getElementById("alg-info").innerHTML = method_to_text[selectedOption];
};

function updateVisualization(){
    selectedOption = d3.select("#vote-method").property("value");
	console.log(selectedOption)
	barchart.updateVis(selectedOption)

    document.getElementById("alg-info").innerHTML = method_to_text[selectedOption];

}


function updateStackedVisualization(){
    selectedOption = d3.select("#show").property("value");
    console.log(selectedOption)
    stackedbar.wrangleData(selectedOption)
}