function TokenVocab({
		id = null,
		width = 220, 
		height = 80,
		perc = 5,
		fill = '#999', 
		fillOpacity, 
		color = '#0080FF',
		color2 = '#99CCFF', 
		strokeWidth = 1.8, 
		strokeOpacity = 0.4, 
		padding = 0,
		paddingT = 6,
	} = {}){

	const svg = d3.create('svg')
			/*.attr('viewBox', viewbox)*/
			.attr('width', width)
			.attr('height', height)
			.attr('style', `max-width: 100%; 
							width: auto; 
							width: intrinsic;`
						)
	let xscale = d3.scaleLinear()
			.domain([0, 100])
			.range([padding, width-padding])

	svg.append('rect')
		.attr('x', padding)
		.attr('y', paddingT)
		.attr('width', xscale(100))
		.attr('height', height-(paddingT))
		.attr('fill', color)

	svg.append('rect')
		.attr('x', padding)
		.attr('y', paddingT)
		.attr('width', xscale(perc))
		.attr('height', height-(paddingT))
		.attr('fill', color2)

	svg.append('text')
		.text(perc + '%')
		.attr('x', xscale(perc)+ 4)
		.attr('y', height/2 + 8)
		.attr('text-anchor', 'left')
		.attr('fill', '#000D1A')
		.attr('font-size', 14)
		.attr('font-weight', 500)


	return svg.node()

}