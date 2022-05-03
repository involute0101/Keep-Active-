module.exports = async ctx => {
	let rid = ctx.request.body.rid

	let u = await PRD.usr.sid(ctx.s)
	let r = await PRD.run.rid(rid)

	if (ctx.v === false) {
		ctx.body = 'invalid'
		return 'man in the middle'
	}

	if (!u || !r || r.sid != u.sid) {
		ctx.body = 'invalid'
		return 'invalid report'
	}

	if (r.status != -1) {
		ctx.body = 'invalid'
		return 'run finished'
	}

	try {
		let routes = JSON.parse(ctx.request.body.route)
		let r = await PRD.loc.add(rid, routes)
		ctx.body = r ? 'success' : 'error'
	} catch(e) {
		console.error('Report Error:', e.message)
		ctx.body = 'invalid'
	}
}
