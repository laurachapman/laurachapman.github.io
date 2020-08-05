

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */

StackedBarChart = function(_parentElement, _legendElement, _data, _height, _width){
	this.parentElement = _parentElement;
	this.legendElement = _legendElement;
	this.data = _data;
	// this.config = _config;
	this.displayData = _data;
	this.h = _height;
	this.w = _width;

	this.initVis();
}



/*
 * Initialize visualization (static content; e.g. SVG area, axes)
 */

StackedBarChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 20, right: 30, bottom: 50, left: 50}
        vis.width = vis.w - vis.margin.left - vis.margin.right,
        vis.height = vis.h - vis.margin.top - vis.margin.bottom;

    vis.y = d3.scaleLinear()
        .rangeRound([vis.height, 0])
        .nice();

    vis.x = d3.scaleBand()
        .rangeRound([0, vis.width])
        .paddingInner(0.05)
        .align(0.1)

    vis.z = d3.scaleOrdinal(d3.schemeCategory20)

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.g = vis.svg.append("g").selectAll("g");
		// .data(vis.layers)
		// // .enter.a

    vis.legendsvg = d3.select("#" + vis.legendElement).append("svg")
        .attr("width", $("#" + vis.parentElement).width() + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + vis.height + ")")

	vis.svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + (0) + ", 0)")


    // text label for the y axis
    vis.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.margin.left)
        .attr("x",0 - (vis.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Votes");

    vis.svg.append("text")
        .attr("transform",
            "translate(" + (vis.width/2) + " ," +
            (vis.height + vis.margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Ranking (1 being the best)");


    selectedOption = d3.select("#show").property("value");
    vis.wrangleData(selectedOption);
	// vis.updateVis();

//

}

StackedBarChart.prototype.legend = function(){
	var vis = this;

// console.
	labs = vis.z.domain();

	legend_data = []

	labs.forEach(function(d, i){
		newobject = {'label': d,
			'position': i,
			'color': vis.z(d)};
		legend_data.push(newobject)
	})
	//
	//
	squares = vis.legendsvg.selectAll(".squares")
        .data(legend_data);

    size = 25;

    squares.enter().append("rect")
        .attr("class", "squares")
        .merge(squares)
        .transition()
        .attr("x", function(d, i){
            return 0
        })
        .attr("y", function(d, i){
            return i*(size*1.2)
        })
        .attr("width", size)
        .attr("height", size)
        .attr("fill", function(d){
            return d.color
        })

    squares.exit().remove()

    labels = vis.legendsvg.selectAll(".labels")
        .data(legend_data);

    labels.enter().append("text")
        .attr("class", "labels")
        .merge(labels)
        .transition()
        .attr("x", size*1.2 )
        .attr("y", function(d, i){
            return i*(size*1.2) + 2*size/3
        })
        .text(function(d){
            return d.label
        })
		.attr("fill", "black")

    labels.exit().remove()


}


StackedBarChart.prototype.updateVis = function(){
	var vis = this;

	vis.svg.selectAll(".groups1").remove();
	vis.svg.selectAll(".axis").remove();

    groups = vis.svg.append("g").selectAll(".groups1")
        .data(vis.layers)
    // groups = vis.svg.selectAll(".groups1")

	groups.enter().append("g")
		.attr("class", "groups1")
		.merge(groups)

	groups = vis.svg.selectAll(".groups1")

	groups.exit().remove()

	bars = groups
        .style("fill", function (d) {
            return vis.z(d.key);
        })
		// .attr("class", "groups")
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        // .on("mouseover", vis.tip.show)
        // .on("mouseout", vis.tip.hide);

	bars
        .enter().append("rect")
		.attr("class", "bars")
		.merge(bars)
		// .transition()
        .attr("x", function (d, i) {
            return vis.x(d.data.place);
        })
        .attr("y", function (d) {
            return vis.y(d[1]);
        })
        .attr("height", function (d) {
            return vis.y(d[0]) - vis.y(d[1]);
        })
        .attr("width", vis.x.bandwidth())
		.on("mouseover", vis.tip.show)
		.on("mouseout", vis.tip.hide)

    bars.transition()

    bars.exit().remove()

    // bars = vis.svg.selectAll(".bars")
    vis.svg.select(".x-axis").call(d3.axisBottom().scale(vis.x));
	vis.svg.select(".y-axis").call(d3.axisLeft().scale(vis.y))

    vis.svg.call(vis.tip);

	vis.svg.append("g")
		.attr("class", "legendOrdinal")
		.attr("transform", "translate(20, 20)")

	vis.legend()
}


StackedBarChart.prototype.wrangleData = function(task){
//	sort the data by selectedOption
	var vis = this;

	og_data = vis.data

    sorted_by_first_place = vis.data.sort((a, b) =>
        (count_in_array(b.votes, 1) > count_in_array(a.votes, 1) ? 1 : -1));

	if(task == 'top-5'){
		// console.log("sorted by first place:", sorted_by_first_place)
		vis.data = sorted_by_first_place.slice(0, 7);
		// vis.data = vis.data.filter(function(e){
		// 	return e
		// })
	}

	mymax = 0
    // dishes = []
	for(var i=0; i<vis.data.length; i=i+1){
		votes = vis.data[i].votes;
		// dishes.push(vis.data[i].dish)
		for(var j=0; j<votes.length; j=j+1){
			if(votes[j] < 100 && votes[j] > mymax){
				mymax = votes[j]
			}
		}
	}

	new_data = []

	for(var i=1; i<mymax+1; i=i+1){
		new_object = {
			place: i.toString(),
		}
		total = 0
		for(var k=0; k<vis.data.length; k=k+1){
			count = count_in_array(vis.data[k].votes, i)
			new_object[vis.data[k].dish] = count
			total += count
		}
		new_object['total'] = total
		new_data.push(new_object)

	}
	// get the most popular ones

	vis.data_stack = new_data

    vis.places = vis.data_stack.map(function(d){
        return d.place
    })

    vis.dishes = Object.keys(vis.data_stack[0])
    vis.dishes = vis.dishes.filter(function (e) { return (e != 'place' && e != 'total')});

    vis.dishes_sorted = vis.dishes.sort((a, b) => (vis.data_stack[0][b] > vis.data_stack[0][a]) ? 1 : -1)

    vis.layers = d3.stack().keys(vis.dishes_sorted)(vis.data_stack);
	old_layers = vis.layers

	tooltip_info = []
	//initialize it to a list of empty dicts of length vis.layers[0].length
	for(var j=0; j<vis.layers[0].length; j=j+1){
		tooltip_info.push({})
	}
	//map each pair
	vis.layers.forEach(function(d){
		for(var i=0; i<d.length; i = i+1){
			dictkey = d[i][0].toString() + "-" + d[i][1].toString()
			tooltip_info[i][dictkey] = d.key
		}

	})
	vis.tooltip_info = tooltip_info

    //tooltips
    vis.tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-5, 0])
        .html(function(d, i) {
            mykey = d[0].toString() + "-" + d[1].toString()
            dish = vis.tooltip_info[i][mykey]
			text = dish + " (" + (d[1]-d[0]).toString() + ")";
			color = vis.z(dish)
            return '<span class="tooltip-title" style="color:' + color + '">'  + text + '</span>';
        });

    vis.layers = old_layers;

    vis.max = d3.max(vis.layers[vis.layers.length - 1], function (d) {
        return d[1];
    });


    vis.y.domain([0, vis.max]);
    vis.x.domain(vis.places);
    vis.z.domain(vis.dishes_sorted);
	vis.data = og_data

	vis.updateVis()
}


function count_in_array(array, element){
    var count = 0;
    for(var i = 0; i < array.length; ++i){
        if(array[i] == element)
            count++;
    }
    return count
}