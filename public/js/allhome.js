$(document).on('ready', function() {
	var memories = [];

	// pull all memories
	$.get('/allmemories', function(data) {
		console.log(data);
		
		// d3 shenanigans
		// STILL GOT IT BABY!!
		
		var memoryDivs = d3.select('#memories').selectAll('div')
			.data(data)
			.enter().append('div')
			.attr("class", "memory");

		memoryDivs.append('h3')
		.text(function(d) {
			return d.place;
			});

		memoryDivs.append('p')
		.text(function(d) {
			return d.memory;
			});
	});
});
