const Time = require('../lib/time')

module.exports = async ctx => {
	let rid = ctx.request.body.rid

	let step = parseInt(ctx.request.body.step)
	let dist = parseInt(ctx.request.body.dist)
	let cost = parseInt(ctx.request.body.cost)

	if (isNaN(dist) || isNaN(cost) || isNaN(step)) {
		ctx.body = { err: 402 }
		return 'data incomplete'
	}

	let u = await PRD.usr.sid(ctx.s)
	if (!(ctx.s || u)) {
		ctx.body = { err: 401 }
		return 'invalid user'
	}

	if (ctx.v === false) {
		ctx.body = { err: 402 }
		return 'man in the middle'
	}

	let r = await PRD.run.rid(rid)
	if (u.sid !== r.sid) { r = false }
	if (r.status != -1) { r = false }
	if (r === false) {
		ctx.body = { err: 402 }
		return 'invalid run id'
	}

	if (Time.diff(r.time) < 1000 * cost) {
		ctx.body = { err: 402 }
		return 'post interval less than cost'
	}

	let mit = await PRD.con.get('mint')
	let mat = await PRD.con.get('maxt')
	let cnt = await PRD.con.get('count')
	let d = await PRD.con.get(u.sex ? 'mdist' : 'wdist')
	r.status = 0
	if (dist < d) {
		r.status = 11
	} else if (cost < mit || mat < cost) {
		r.status = 12
	} else if (u.succ >= cnt) {
		r.status = 13
	}

	if (!await PRD.run.set(rid, cost, dist, step, r.status)) {
		ctx.body = { err: -1 }
		return 'update database error'
	}

	ctx.body = { err: r.status }
}
