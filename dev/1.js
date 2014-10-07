const web = require('../')

const page = web.page(function(h) {
	h.doctype('html')
	h.html(function() {
		h.head(function() {
			h.meta({ charset: 'utf-8' })
			h.title('HI!')
		})
	})
})

const pull = require('pull-stream')
const stack = []
pull(
	page(),
	pull.filter(function(p) {
		return typeof(p) == 'object' && p !== null && (p[0] == 'open' || p[0] == 'content' || p[0] == 'close')
	}),
	pull.map(function(p) {
		switch(p[0]) {
		case 'open':
			var res = '<' + p[1]
			Object.keys(p[2]).forEach(function(k) {
				res += ' ' + k + '="' + p[2][k] + '"'
			})
			res += '>'
			stack.push(p[1])
			return res

		case 'content':
			return p[1]

		case 'close':
			return '</' + stack.pop() + '>'
		}
	}),
	pull.log()
)