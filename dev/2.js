const web = require('../')
const ui  = web.ui

function layout(body) {
	return ui.comp(body())
}

const site = web.router({
	_root: function() {
		return web.page(function() {
			return layout(function() {
				return ui.text('HI!')
			})
		})
	}
})