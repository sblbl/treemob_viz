let statsW = 0

$(document).ready(() => {

	draw().then(() => handleInteraction())

	

	$(window).resize(() => {
		clean().then(() => {draw()})
	})

})

let handleInteraction = () => {
	$('.node').hover( e => {
		let $t = $(e.target),
			loc = $t.attr('loc')
		
		$(`.node:not(.${loc})`).addClass('light')
		$('tree-link').addClass('light')

	}, e => {
		$('.light').removeClass('light')
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
}

let clean = () => {
	$('#in-tree').find('svg').remove()
	$('#out-tree').find('svg').remove()
	$('#outdeg').find('svg').remove()
	$('#bar-in').find('svg').remove()
	$('#bar-out').find('svg').remove()
	$('#tokvoc-all').find('svg').remove()
	$('#tokvoc-in').find('svg').remove()
	$('#tokvoc-out').find('svg').remove()
	return Promise.resolve()
}

let first = () => {
	let in_chart = Tree(in_tree, {
		label: d => d.name,
		stroke: '#FFD700',
		start: 'top'
	})
	$('#in-tree').append(in_chart)
	return Promise.resolve()
}

let draw = () => {
	
	first()
		.then(() => {
			let out_chart = Tree(out_tree, {
				label: d => d.name,
				stroke: '#00E68E',
				start: 'bottom'
			})
			$('#out-tree').append(out_chart)
		})
		.then(() => {
			statsW = $('.stats')[0].offsetWidth - (parseFloat(getComputedStyle($('.stats')[0]).paddingLeft)*2)
			let deg_chart = OutDeg({width : statsW})
			$('#outdeg').append(deg_chart)
		})
		.then(() => {
			let bars_in = BarLeaves({
				target : '#in-tree', 
				start : 'top',
				color : '#FFD700'
			})
			$('#bar-in').append(bars_in)
		})
		.then(() => {
			let bars_out = BarLeaves({
				target : '#out-tree', 
				start : 'bottom',
				color : '#00E68E'
			})
			$('#bar-out').append(bars_out)
		})
		.then(() => {
			tokvoc_chart_all = TokenVocab({
				width : statsW, 
				height : 48,
				perc : 39.00, 
			})
			$('#tokvoc-all').append(tokvoc_chart_all)
		})
		.then(() => {
			tokvoc_chart_in = TokenVocab({
				width : statsW, 
				height : 48,
				perc : 51.03, 
				color : '#FFD700', 
				color2 : '#FFEC80',
			})
			$('#tokvoc-in').append(tokvoc_chart_in)
		})
		.then(() => {
			tokvoc_chart_out = TokenVocab({
				width : statsW, 
				height : 48,
				perc : 41.49, 
				color : '#00E68E', 
				color2 : '#80FFCE',
			})
			$('#tokvoc-out').append(tokvoc_chart_out)
		})

		return Promise.resolve()

}