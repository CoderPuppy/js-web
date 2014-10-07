const pull = require('pull-stream')
pull.pushable = require('pull-pushable')

const tagNames = 'html head body meta title a p div link'.split(/\s+/g)

function htmlStream() {
	const stream = pull.pushable()

	stream.h = {}

	stream.h.doctype = function(doctype) {
		stream.h.content('<!doctype ' + doctype + '>')
	}

	stream.h.tag = function(name, attrs, content) {
		if(typeof(name) != 'string') throw new TypeError('tagname must be a string')
		if(typeof(attrs) != 'object' || attrs === null) {
			content = attrs
			attrs = {}
		}
		if(typeof(content) != 'function' && typeof(content) != 'string') content = function(h) {}
		if(typeof(content) != 'function') {
			var contentText = content
			content = function(h) {
				h.content(contentText)
			}
		}

		stream.push([ 'open', name, attrs ])

		const thunk = content(stream.h)

		if(typeof(thunk) == 'function') {
			thunk(function(err, res) {
				stream.push([ 'close' ])
			})
		} else {
			stream.push([ 'close' ])
		}
	}

	tagNames.forEach(function(name) {
		stream.h[name] = stream.h.tag.bind(stream.h, name)
	})

	stream.h.content = function() {
		stream.push([ 'content', [].join.call(arguments, '') ])
	}

	return stream
}

module.exports = function(render) {
	function page() {
		const stream = htmlStream()
		render(stream.h)
		return stream
	}
	page.render = render

	return page
}