module.exports = async ctx => {
	if (!ctx.valid) {
		ctx.body = { err: -1 }
		return 'invalid token'
	}

	let rid = ctx.request.body.rid
	if (rid === undefined) {
		ctx.body = { err: 1 }
		return 'incomplete args'
	}

	ctx.body = {
		err: 0,
		data: await PRD.loc.rid(rid)
	}
}
