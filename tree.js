// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// edited from https://observablehq.com/@d3/tree
function Tree(data, { 
		path, 
		id = Array.isArray(data) ? d => d.id : null, 
		parentId = Array.isArray(data) ? d => d.parentId : null, 
		children, 
		tree = d3.tree, 
		sort, 
		label, 
		title, 
		width = 500, 
		height = 320, 
		r = 4, 
		padding = 1, 
		fill = '#FFF', 
		fillOpacity, 
		stroke = '#555', 
		strokeWidth = 1.8, 
		strokeOpacity = 0.5, 
		strokeLinejoin, 
		strokeLinecap, 
		halo = '#fff', 
		haloWidth = 3, 
		start = 'top'
	} = {}) {

	width = $('#tree-container').width()

	const root = path != null ? d3.stratify().path(path)(data)
			: id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data)
			: d3.hierarchy(data, children);
	// Compute labels and titles.
	const descendants = root.descendants();
	const L = label == null ? null : descendants.map(d => label(d.data, d));

	// Sort the nodes.
	if (sort != null) root.sort(sort);

	// Compute the layout.
	const dx = 10
	const dy = height / (root.height + padding)
	tree().nodeSize([dx, dy])(root)

	// Center the tree.
	let y0 = Infinity;
	let y1 = -y0;

	root.each(d => {
		//console.log(d.y)
		if (d.y > y1) y1 = d.y
		if (d.y < y0) y0 = d.y
	})

	//[-dy * padding / 2, x0 - dx, width, height]
	let viewbox = [-y1-(width/5) , -dx * padding / 2, width, height]
	//console.log(viewbox)

	const svg = d3.create('svg')
			//.attr('viewBox', viewbox)
			.attr('width', width)
			.attr('height', height)

	let layers = Array.from(d3.group(root.descendants(), d => d.depth).keys())
	console.log(layers, d3.max(layers))

	let scaley = d3.scaleLinear()
			.domain([0, d3.max(layers)])
			.range(start == 'top' ? [padding, dy * (layers.length-1)] : [height-padding, height-padding-dy * (layers.length-1)])

	svg.append('g')
		.selectAll('line')
			.data(layers)
			.join('line')
				.attr('class', 'grid')
				.attr('stroke', stroke)
				.attr('stroke-width', '1')
				.attr('stroke-opacity', d => d == 0 ? 0 : .2)
				.attr('x1', padding)
				.attr('x2', width - padding - 24)
				.attr('y1', d => scaley(d))
				.attr('y2', d => scaley(d))

	svg.append('g')
		.selectAll('text')
			.data(layers)
			.join('text')
				.text((d, i) => i)
				.attr('class', 'grid-label')
				.attr('x', width - padding - 16)
				.attr('y', d => scaley(d) + 7)
				.attr('fill', stroke)
				.attr('font-size', 13)
				.attr('opacity', (d, i) => i == 0 ? 0 : 1)


	svg.append('g')
		.attr('fill', 'none')
		.attr('stroke', stroke)
		.attr('stroke-opacity', strokeOpacity)
		.attr('stroke-linecap', strokeLinecap)
		.attr('stroke-linejoin', strokeLinejoin)
		.attr('stroke-width', strokeWidth)
	.selectAll('path')
		.data(root.links())
		.join('path')
			.attr('d', d3.linkVertical()
				.x(d => d.x + (width/2))
				.y(d => (start == 'top') ? d.y : height - padding - d.y))
			.attr('from', d => d.source.data.name)
			.attr('to', d => d.target.data.name)
			.attr('class', 'tree-link')

	const node = svg.append('g')
		.selectAll('circle')
		.data(root.descendants())
		.join('circle')
			//.attr('class', d => d.children ? 'node' : 'leaf')
			.attr('class', (d, i) => {
				let c = 'node'
				if (!d.children) {
					c += ' leaf'
				}
				c += ' '  + L[i]
				return c
			})
			.attr('fill', d => d.children ? stroke : fill)
			.attr('r', r)
			.attr('loc', (d, i) => L[i])
			.attr('cx', d => d.x + (width/2))
			.attr('cy', d => (start == 'top') ? d.y : height - padding - d.y)
			.attr('style', 'cursor : pointer')

	if (start == 'top') {
		svg.append('text')
		.text('Incoming tree')
		.attr('x', padding)
		.attr('y', padding + dy + 4)
		.attr('fill', '#FFF')
	} else {
		svg.append('text')
		.text('Outcoming tree')
		.attr('x', padding)
		.attr('y', height - padding - dy + 4)
		.attr('fill', '#FFF')
	}

	
	return svg.node();
}

/*in_chart = Tree(in_tree, {
	label: d => d.name,
	stroke: '#FFD700',
	start: 'top'
})

out_chart = Tree(out_tree, {
	label: d => d.name,
	stroke: '#00E68E',
	start: 'bottom'
})*/

/*document.querySelector('#in-tree').append(in_chart)
document.querySelector('#out-tree').append(out_chart)*/




