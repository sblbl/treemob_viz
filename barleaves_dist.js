function BarLeavesDist({
		id = null,
		width = 300, 
		height = null,
		target = null,
		color = '#0080FF',
		color2 = '#99CCFF', 
		start = 'top', 
		padding = 10,
		margin_l = 0,
		barh = 20
	} = {}){

	let wscale = d3.scaleLinear()
			.domain([0, 100])
			.range([0, width-(padding+margin_l)]) 

	let $target = $(target), 
		ticks = $target.find('.dist-grid'), 
		leaves = $target.find('.leaf'), 
		y_ranges = [],
		data = {}, 
		bars = []

	height = $target.height()

	let valscale = d3.scaleLinear()
			.domain([0, leaves.length])
			.range([0, 100])

	ticks.each((i, tick) => {
		let y = tick.getAttribute('y1')
		y_ranges.push(parseInt(y))
	})
	

	if (start == 'top') {
		y_ranges.sort(function(a, b){return b - a})
		leaves.each((i, leaf) => {
			let y = leaf.getAttribute('cy')
			let tick = 0
			for (j = 0; j < y_ranges.length; j++) {
				if (y > y_ranges[j]) {
					tick = y_ranges[j]
					break 
				}
			}
			if (! (tick in data)) {
				data[tick] = 0
			}
			data[tick] += 1
		})
	} else {
		y_ranges.sort(function(a, b){return a - b})
		leaves.each((i, leaf) => {
			let y = leaf.getAttribute('cy')
			let tick = 0
			for (j = 0; j < y_ranges.length; j++) {
				if (y < y_ranges[j]) {
					tick = y_ranges[j]
					break 
				}
			}
			if (! (tick in data)) {
				data[tick] = 0
			}
			data[tick] += 1
		})
	}
	
	let spacing = 0
	
	if (start == 'top') {
		spacing = (y_ranges[1] - y_ranges[0])/2
	} else {
		spacing = (y_ranges[1] - y_ranges[0])/2
	}

	Object.keys(data).forEach((k) => {
		bars.push({
			y : k - spacing, 
			perc : valscale(data[k])
		})
	})

	const svg = d3.create('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('style', `max-width: 100%; 
							width: auto; 
							width: intrinsic;`
						)

	svg.append('g')
		.selectAll('rect')
			.data(bars)
			.join('rect')
				.attr('x', margin_l)
				.attr('y', d => start == 'top' ? d.y - (barh/2) : d.y - (barh/2))
				.attr('width', d => wscale(d.perc))
				.attr('height', barh)
				.attr('fill', color)

	
	if (start == 'top') {
		svg.append('g')
			.selectAll('text')
				.data(bars)
				.join('text')
					.text(d => d.perc.toFixed(2) + '%')
					.attr('x', d => (wscale(d.perc) + 8))
					.attr('y', d => d.y - (barh/2) + 13)
					.attr('fill', '#FFF')
					.attr('font-size', 13)
	} else {
		svg.append('g')
			.selectAll('text')
				.data(bars)
				.join('text')
					.text(d => d.perc.toFixed(2) + '%')
					.attr('x', d => (wscale(d.perc) + 8))
					.attr('y', d => d.y - (barh/2) + 13)
					.attr('fill', '#FFF')
					.attr('font-size', 13)
	}
	
	return svg.node()

}