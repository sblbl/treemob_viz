function Entropy({
		id = null,
		width = 400, 
		height = 200,
		n_weights,
		fill = '#999', 
		fillOpacity, 
		color = '#0080FF',
		color2 = '#99CCFF', 
		strokeWidth = 1.8, 
		strokeOpacity = 0.4, 
		padding = 20,
		paddingT = 32,
	} = {}){

	const locs = Object.keys(n_weights), 
			freqs = Object.values(n_weights),
			totFreqs = freqs.reduce((partialSum, a) => partialSum + a, 0), 
			entropies = freqs.map(d => {
				return (- Math.log2(d / totFreqs))
			})

	const svg = d3.create('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('style', `max-width: 100%; 
							width: auto; 
							width: intrinsic;`)

	let xscale = d3.scaleLinear()
			.domain([0, parseInt(d3.max(entropies))])
			.range([padding, width-padding])

	let histogram = d3.histogram()
		.value(d => d)
		.domain(xscale.domain())
		.thresholds(xscale.ticks(parseInt(xscale.domain()[1]/0.5)))

	bins = histogram(entropies)

	binClasses = []

	bins.forEach(bin => {
		let classes = []
		for (let i = 0; i < locs.length; i++) {
			if (entropies[i] > bin.x0 && entropies[i] <= bin.x1 ) {
				classes.push(locs[i])
			}
		}
		binClasses.push(classes)
	})

	let yscale = d3.scaleLinear()
		.domain([0, d3.max(bins, d => d.length)])
		.range([0, height-(paddingT*2)])
	
	
	let xTicks = Array.from(Array(parseInt(d3.max(entropies)/.5)-1).keys(), n => n * 0.5)
	let yTicks = Array.from(Array(parseInt(d3.max(bins, d => d.length)/5)+2).keys(),n => n * 5)

	svg.append('g')
		.selectAll('line')
		.data(yTicks)
		.enter()
		.append('line')
			.attr('class', 'grid')
			.attr('stroke', '#0080FF')
			.attr('stroke-width', '1')
			.attr('stroke-opacity', .2)
			.attr('x1', padding)
			.attr('x2', width- padding)
			.attr('y1', d => height - paddingT - yscale(d))
			.attr('y2', d => height - paddingT - yscale(d))

	svg.append('g')
		.selectAll('text')
		.data(yTicks)
		.enter()
		.append('text')
			.text(d => d)
			.attr('fill', '#0080FF')
			.attr('x', padding - 4)
			.attr('y', d => height - paddingT - yscale(d) + 4)
			.attr('font-size', 12)
			.attr('text-anchor', 'right')

	svg.append('g')
		.selectAll('line')
		.data(xTicks)
		.enter()
		.append('line')
			.attr('class', 'grid')
			.attr('stroke', '#0080FF')
			.attr('stroke-width', '1')
			.attr('stroke-opacity', .2)
			.attr('x1', d => xscale(d+.25))
			.attr('x2', d => xscale(d+.25))
			.attr('y1', height-paddingT)
			.attr('y2', height-paddingT+4)

	svg.append('g')
		.selectAll('text')
		.data(xTicks)
		.enter()
		.append('text')
			.text(d => d + .5)
			.attr('fill', '#0080FF')
			.attr('x', d => xscale(d+.25))
			.attr('y', height - paddingT + 14)
			.attr('font-size', 12)
			.attr('text-anchor', 'middle')

	svg.selectAll('rect')
		.data(bins)
		.enter()
		.append('rect')
			.attr('count', d => d.length)
			.attr('class', ((d, i) => {
				let c = 'entropy-bar '
				if (binClasses[i].length > 0) {
					for (j = 0; j < binClasses[i].length; j ++) {
						c += binClasses[i][j] + ' '
					}
				}
				return c
			}))
			.attr('x', d => xscale(d.x0))
			.attr('y', d => height - paddingT - yscale(d.length))
			.attr('width', d => xscale(d.x1) - xscale(d.x0))
			.attr('height', d => yscale(d.length))
			.style('fill', '#0080FF')

	svg.append('g')
		.selectAll('text')
		.data(bins)
		.enter()
		.append('text')
			.text(d => d.length)
			.attr('x', d => xscale(d.x0) + ((width/bins.length)/2))
			.attr('y', d => height - paddingT - yscale(d.length) - 6)
			.attr('font-size', 14)
			.attr('font-weight', 500)
			.attr('text-anchor', 'middle')
			.attr('fill', '#FFF')
			.attr('opacity', d => {
				return d.length > 0 ? 1 : 0
			})

	svg.append('text')
		.text('entropy')
		.attr('x', width/2)
		.attr('y',height-2)
		.attr('font-size', 16)
		.attr('text-anchor', 'middle')
		.attr('font-variant', 'small-caps')
		.attr('letter-spacing', 1.5)
		.attr('fill', '#FFF')

	svg.append('text')
		.text('count')
		.attr('x', 10)
		.attr('y',height/2)
		.attr('font-size', 14)
		.attr('text-anchor', 'middle')
		.attr('writing-mode', 'tb')
		.attr('font-variant', 'small-caps')
		.attr('letter-spacing', 1.5)
		.attr('fill', '#FFF')



	return svg.node()

}