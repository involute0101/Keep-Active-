const Time = require('../lib/time')

module.exports = async ctx => {
	let u = await PRD.usr.sid(ctx.s)

	if (!await Time.valid()) {
		ctx.body = { err: 300 }
		return 'can not start' 
	}

	if (!(ctx.s || u)) {
		ctx.body = { err: 301 }
		return 'invalid user'
	}

	if (ctx.v === false) {
		ctx.body = { err: 302 }
		return 'man in the middle'
	}

	let r = await PRD.run.add(ctx.s)
	if (r === false) {
		ctx.body = { err: 302 }
		return 'error while set rid'
	}

	ctx.body = { err: 0, rid: r }
}
