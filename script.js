let statsW = 0, 
	trees, 
	currentTree, 
	showDist = false,
	treeH = 270

$(document).ready(() => {
	trees = {
			'501923' : tree_501923, 
			'1054708' : tree_1054708, 
			'60890' : tree_60890
		}

	currentTree = trees['501923']

	draw()


	$(window).resize(() => {
		clean().then(draw())
	})

	$('.info-icon').hover(e => {
		let $t = $(e.target),
			id = $t.attr('id'), 
			infoId = id.replace('-icon', '')

		$('#info').addClass('show')
		$(`#${infoId}`).addClass('show')

		let t = $t.offset().top, 
			l = $t.offset().left + 16

		if (t + $('#info').height() >= $(window).height() - 12) {
			t -= ($('#info').height() + 12)
		}

		if (l + $('#info').width() >= $(window).width() - 12) {
			l -= ($('#info').width() + 16 + 32)
		}

		$('#info').css({'top' : t, 'left' : l})

	}, e => {
		$('.show').removeClass('show')
	})

	$('.toggle-treemob').click( e => {
		showDist = !showDist
		console.log(showDist)
		clean().then(draw())
	})
})

let clean = () => {
	$('#in-tree').find('svg').remove()
	$('#out-tree').find('svg').remove()
	$('#outdeg').find('svg').remove()
	$('#bar-in').find('svg').remove()
	$('#bar-out').find('svg').remove()
	$('#tokvoc-all').find('svg').remove()
	$('#tokvoc-in').find('svg').remove()
	$('#tokvoc-out').find('svg').remove()
	$('#dist-tree-in').find('svg').remove()
	$('#dist-tree-out').find('svg').remove()
	$('#bar-in-dist').find('svg').remove()
	$('#bar-out-dist').find('svg').remove()
	$('#entropy').find('svg').remove()
	return Promise.resolve()
}

let handlePanels = () => {
	if (!showDist) {
		$('#treemob').removeClass('hidden')
		$('#treemob-dist').addClass('hidden')
	} else {
		$('#treemob-dist').removeClass('hidden')
		$('#treemob').addClass('hidden')
	}

	return Promise.resolve()
}

let drawTrees = () => {
	if (!showDist) {
		let in_chart = Tree(currentTree.in_tree, {
			label: d => d.name,
			n_weights : currentTree.n_weights,
			stroke: '#FFD700',
			start: 'top',
			height : treeH
		})
		$('#in-tree').append(in_chart)
		let out_chart = Tree(currentTree.out_tree, {
			label: d => d.name,
			n_weights : currentTree.n_weights,
			stroke: '#00E68E',
			start: 'bottom',
			height : treeH
		})
		$('#out-tree').append(out_chart)	
	} else {
		dist_tree_in = TreeDists(currentTree.in_tree, {
			label: d => d.name,
			dist : d => d.dist,
			n_weights : currentTree.n_weights,
			max_dist : currentTree.max_dist,
			stroke: '#FFD700',
			start: 'top',
			height : treeH
		})
		$('#dist-tree-in').append(dist_tree_in)
		dist_tree_out = TreeDists(currentTree.out_tree, {
			label: d => d.name,
			dist : d => d.dist,
			n_weights : currentTree.n_weights,
			max_dist : currentTree.max_dist,
			stroke: '#00E68E',
			start: 'bottom',	
			height : treeH
		})

		$('#dist-tree-out').append(dist_tree_out)
	}
	
	return Promise.resolve()
}

let drawBars = () => {
	if (!showDist) {
		let bars_in = BarLeaves({
			target : '#in-tree', 
			start : 'top',
			color : '#FFD700',
			height : treeH
		})
		$('#bar-in').append(bars_in)
		let bars_out = BarLeaves({
			target : '#out-tree', 
			start : 'bottom',
			color : '#00E68E',
			height : treeH
		})
		$('#bar-out').append(bars_out)
	} else {
		let bars_in = BarLeavesDist({
			target : '#dist-tree-in', 
			start : 'top',
			color : '#FFD700',
			height : treeH
		})
		$('#bar-in-dist').append(bars_in)
		let bars_out = BarLeavesDist({
			target : '#dist-tree-out', 
			start : 'bottom',
			color : '#00E68E',
			height : treeH
		})
		$('#bar-out-dist').append(bars_out)
	}
}

let draw = () => {
	$('#username').html('#' + currentTree.id)
	handlePanels()
		.then(drawTrees())
		.then(drawBars())
		.then(() => {
			statsW = $('.stats')[0].offsetWidth - (parseFloat(getComputedStyle($('.stats')[0]).paddingLeft)*2)
			let deg_chart = OutDeg({
				width : statsW, 
				height : 188,
				maxOutDeg_all : currentTree.maxOutDeg_all,
				medianOutDeg_all : currentTree.medianOutDeg_all,

				maxOutDeg_in : currentTree.maxOutDeg_in,
				medianOutDeg_in : currentTree.medianOutDeg_in,

				maxOutDeg_out : currentTree.maxOutDeg_out,
				medianOutDeg_out : currentTree.medianOutDeg_out
			})
			$('#outdeg').append(deg_chart)

			tokvoc_chart_all = TokenVocab({
				width : statsW, 
				height : 32,
				perc : currentTree.tokvoc_all 
			})
			$('#tokvoc-all').append(tokvoc_chart_all)

			tokvoc_chart_in = TokenVocab({
				width : statsW, 
				height : 32,
				perc : currentTree.tokvoc_in, 
				color : '#FFD700', 
				color2 : '#FFEC80',
			})
			$('#tokvoc-in').append(tokvoc_chart_in)

			tokvoc_chart_out = TokenVocab({
				width : statsW, 
				height : 32,
				perc : currentTree.tokvoc_out, 
				color : '#00E68E', 
				color2 : '#80FFCE',
			})
			$('#tokvoc-out').append(tokvoc_chart_out)

			entropy = Entropy({
				n_weights : currentTree.n_weights,
				height : 180,
			})

			document.querySelector('#entropy').append(entropy)
		})

		$('.node').hover(e => {
			let $t = $(e.target),
				loc = $t.attr('loc')
			
			$(`.node:not(.${loc})`).addClass('light')
			$(`.entropy-bar:not(.${loc})`).addClass('light')
			$('tree-link').addClass('light')

		}, e => {
			$('.light').removeClass('light')
		})

		/*$('.entropy-bar').hover(e => {
			let $t = $(e.target),
				classes = $t.attr('class').split(/\s+/)
			for (i = 0; i < classes.length; i ++) {
				
			}
		}, e => {
			$('.light').removeClass('light')
		})*/

		return Promise.resolve()

}