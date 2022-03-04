function BarLeaves({
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
		leaves = $target.find('.leaf'), 
		data = {}, 
		bars = []

	//height = 320

	let valscale = d3.scaleLinear()
			.domain([0, leaves.length])
			.range([0, 100])


	leaves.each((i, leaf) => {
		let y = leaf.getAttribute('cy')
		if (! (y in data)) {
			data[y] = 0
		}
		data[y] += 1
	})

	Object.keys(data).forEach((k) => {
		bars.push({
			y : parseFloat(k), 
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
				.attr('y', d => d.y - (barh/2))
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
					.attr('y', d => d.y - (barh/2) + 16)
					.attr('fill', '#FFF')
					.attr('font-size', 13)
	} else {
		svg.append('g')
			.selectAll('text')
				.data(bars)
				.join('text')
					.text(d => d.perc.toFixed(2) + '%')
					.attr('x', d => (wscale(d.perc) + 8))
					.attr('y', d => d.y - (barh/2) + 16)
					.attr('fill', '#FFF')
					.attr('font-size', 13)
	}
	
	return svg.node()

}