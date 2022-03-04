function OutDeg({
		id = null,
		width = 220, 
		height = 200,
		
		maxOutDeg_all = 17,
		medianOutDeg_all = 2,

		maxOutDeg_in = 16,
		medianOutDeg_in = 2,

		maxOutDeg_out = 9,
		medianOutDeg_out = 2,
		fill = '#0080FF', 

		stroke_all = '#0080FF',

		stroke_in = '#FFD700', 

		stroke_out = '#00E68E',

		strokeWidth = 1.8, 
		strokeOpacity = 0.4, 
		padding = 12,
		paddingT = 8
	} = {}){

	const svg = d3.create('svg')
			/*.attr('viewBox', viewbox)*/
			.attr('width', width)
			.attr('height', height)
			.attr('style', `max-width: 100%; 
							width: auto; 
							width: intrinsic;`
						)

	let maxDeg = d3.max([maxOutDeg_all, maxOutDeg_in, maxOutDeg_out])

	let sourceCoords = [width/2, height/2],
		xscale = d3.scaleLinear()
			.domain([0, maxDeg-1])
			.range([padding, width-padding]), 
		links_all = [], 
		links_in = [], 
		links_out = []

	x = padding	

	for (let i = 0; i < maxOutDeg_all; i++) {
		links_all.push({
			source : sourceCoords, 
			target : [xscale(i), (height / 2) - paddingT - 22]
		})
	}

	for (let i = 0; i < maxOutDeg_in; i++) {
		links_in.push({
			source : sourceCoords, 
			target : [xscale(i), (height) - paddingT - 22]
		})
	}

	for (let i = 0; i < maxOutDeg_out; i++) {
		links_out.push({
			source : sourceCoords, 
			target : [xscale(i), paddingT + 22]
		})
	}

	// IN
	svg.append('g')
		.selectAll('path')
			.data(links_in)
			.join('path')
				.attr('d', d3.linkVertical())
					.attr('fill', 'none')
					.attr('stroke-width', strokeWidth)
					.attr('stroke', stroke_in)
					.attr('stroke-dasharray', (d, i) => {
						return i < medianOutDeg_in ? 'none' : '3 3'
					})

	svg.append('text')
		.text(medianOutDeg_in)
		.attr('x', xscale(medianOutDeg_in -1))
		.attr('y', height - paddingT)
		.attr('text-anchor', 'middle')
		.attr('fill', '#FFF')

	svg.append('text')
		.text(maxOutDeg_in)
		.attr('x', xscale(maxOutDeg_in -1))
		.attr('y', height - paddingT)
		.attr('text-anchor', 'middle')
		.attr('fill', '#FFF')

	svg.append('g')
		.selectAll('circle')
			.data(links_in)
			.join('circle')
				.attr('r', 3)
				.attr('cx', d => {
					return d.target[0]
				})
				.attr('cy', d => {
					return d.target[1] + 3
				})
				.attr('fill', (d, i) => {
						return i < medianOutDeg_in ? stroke_in : stroke_in
					})

	// OUT

	svg.append('g')
		.selectAll('path')
			.data(links_out)
			.join('path')
				.attr('d', d3.linkVertical())
					.attr('fill', 'none')
					.attr('stroke-width', strokeWidth)
					.attr('stroke', stroke_out)
					.attr('stroke-dasharray', (d, i) => {
						return i < medianOutDeg_out ? 'none' : '3 3'
					})

	svg.append('text')
		.text(medianOutDeg_out)
		.attr('x', xscale(medianOutDeg_out -1))
		.attr('y', padding + 12)
		.attr('text-anchor', 'middle')
		.attr('fill', '#FFF')

	svg.append('text')
		.text(maxOutDeg_out)
		.attr('x', xscale(maxOutDeg_out -1))
		.attr('y',  padding + 12)
		.attr('text-anchor', 'middle')
		.attr('fill', '#FFF')

	svg.append('g')
		.selectAll('circle')
			.data(links_out)
			.join('circle')
				.attr('r', 3)
				.attr('cx', d => {
					return d.target[0]
				})
				.attr('cy', d => {
					return d.target[1] + 3
				})
				.attr('fill', (d, i) => {
						return i < medianOutDeg_out ? stroke_out : stroke_out
					})


	// ALL

	svg.append('line')
		.attr('fill', 'none')
		.attr('stroke-width', strokeWidth)
		.attr('stroke', stroke_all)
		.attr('x1', xscale(medianOutDeg_all -1))
		.attr('x2', sourceCoords[0])
		.attr('y1', sourceCoords[1] + 3)
		.attr('y2', sourceCoords[1] + 3)
		.attr('stroke-dasharray', 'none')

	svg.append('line')
		.attr('fill', 'none')
		.attr('stroke-width', strokeWidth)
		.attr('stroke', stroke_all)
		.attr('x1', xscale(maxOutDeg_all -1))
		.attr('x2', sourceCoords[0])
		.attr('y1', sourceCoords[1] + 3)
		.attr('y2', sourceCoords[1] + 3)
		.attr('stroke-dasharray', '3 3')


	svg.append('circle')
		.attr('r', 3)
		.attr('cx', xscale(maxOutDeg_all -1))
		.attr('cy', sourceCoords[1] + 3)
		.attr('fill', stroke_all)

	svg.append('circle')
		.attr('r', 3)
		.attr('cx', xscale(medianOutDeg_all -1))
		.attr('cy', sourceCoords[1] + 3)
		.attr('fill', stroke_all)

	svg.append('text')
		.text(medianOutDeg_all)
		.attr('x', xscale(medianOutDeg_all -1))
		.attr('y', (height/2) - 6)
		.attr('text-anchor', 'middle')
		.attr('fill', '#FFF')

	svg.append('text')
		.text(maxOutDeg_all)
		.attr('x', xscale(maxOutDeg_all -1))
		.attr('y',  (height/2) - 6)
		.attr('text-anchor', 'middle')
		.attr('fill', '#FFF')



	svg.append('circle')
		.attr('r', 3)
		.attr('cx', sourceCoords[0])
		.attr('cy', sourceCoords[1] + 3)
		.attr('fill', stroke_all)


	return svg.node()

}

/*let statsW = $('.stats')[0].offsetWidth - (parseFloat(getComputedStyle($('.stats')[0]).paddingLeft)*2)
deg_chart = OutDeg({width : statsW})*/