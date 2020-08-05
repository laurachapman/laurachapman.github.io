

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

BarChart = function(_parentElement, _data, _height, _width, _colorscale){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;
	this.h = _height;
	this.w = _width;
	this.colorScale = _colorscale;

	this.initVis();
}



/*
 * Initialize visualization (static content; e.g. SVG area, axes)
 */

BarChart.prototype.initVis = function(){
	var vis = this;

	vis.margin = { top: 20, right: 50, bottom: 20, left: 200 };

	// Get width of parent element with jQuery -->  responsive webpage
    vis.width = vis.w - vis.margin.left - vis.margin.right,
		// vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
	vis.height = vis.h - vis.margin.top - vis.margin.bottom;


	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement)
		.append("div")
			.attr("class", "barchart")
		.append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


	// Scales and axes
	vis.x = d3.scaleLinear()
		.range([0, vis.width]);

	vis.y = d3.scaleBand()
		.rangeRound([vis.height, 0])
		.paddingInner(0.2);

	vis.yAxis = d3.axisLeft()
			.scale(vis.y);

	vis.svg.append("g")
			.attr("class", "y-axis axis");


	// Headline
	vis.svg.append("text")
			.attr("class", "barchart-headline")
			.attr("x", -100)
			.attr("y", -10)
			.attr("dy", ".35em")
			// .text("Chart title (change this)");

    // vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10)
	// vis.colorScale.domain(vis.data.map(function(d){
	// 	return d.dish;
	// }))

    selectedOption = d3.select("#vote-method").property("value");
	// (Filter, aggregate, modify data)
	vis.updateVis(selectedOption);
}




/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

BarChart.prototype.updateVis = function(selectedOption){
	var vis = this;

	// sort
    vis.wrangleData(selectedOption);

    // Update domain
	vis.y.domain(vis.data.map(function(d) {
		return d.dish;
	}));
	vis.x.domain([0, d3.max(vis.data, function(d) { return d[selectedOption]; })]);


	// Draw rectangles
	var bars = vis.svg.selectAll(".bar")
			.data(vis.data);
	
	bars.enter().append("rect")
			.attr("class", "bar")

		.merge(bars)
			.transition()
			.attr("x", 0)
			.attr("width", function(d) {
				return vis.x(d[selectedOption]); 
			})
		.attr("fill", function(d){
			return vis.colorScale(d.dish);
		})
			.attr("y", function(d) { return vis.y(d.dish); })
			.attr("height", function(d) { return vis.y.bandwidth(); });

	bars.exit().remove();


	// Draw labels
	var barLabels = vis.svg.selectAll(".bar-label")
			.data(vis.data);

	barLabels.enter().append("text")
			.attr("class", "bar-label")

		.merge(barLabels)
			.transition()
			.attr("x", function(d) { return vis.x(d[selectedOption]) + 5; })
			.attr("y", function(d) { return vis.y(d.dish) + vis.y.bandwidth()/2; })
			.attr("dy", ".35em")
			.text(function(d) { return d[selectedOption].toFixed(2); });

	barLabels.exit().remove();

    // Draw labels
    var voteLabels = vis.svg.selectAll(".vote-label")
        .data(vis.data);

    voteLabels.enter().append("text")
        .attr("class", "vote-label")

        .merge(voteLabels)
        .transition()
        .attr("x", 5)
        .attr("y", function(d) { return vis.y(d.dish) + vis.y.bandwidth()/2; })
        .attr("dy", ".35em")
		.attr("font-size", 10)
		.attr("fill", "white")
        .text(function(d) {
        	return d.num_votes + " votes";
        });

    voteLabels.exit().remove();


	// Update the y-axis
	vis.svg.select(".y-axis").call(vis.yAxis);
}


BarChart.prototype.wrangleData = function(selectedOption){
//	sort the data by selectedOption
	var vis = this;
	vis.data.sort((a, b) => (a[selectedOption] > b[selectedOption]) ? 1 : -1)
}