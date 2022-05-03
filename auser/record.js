module.exports = async ctx => {
	let u = await PRD.usr.sid(ctx.s)

	if (!(ctx.s || u)) {
		ctx.body = { err: 501 }
		return 'invalid user'
	}

	if (ctx.v === false) {
		ctx.body = { err: 502 }
		return 'man in the middle'
	}

	let d = await PRD.run.usr(ctx.s)
	for (let i of d) { i.date = undefined }
	for (let i = 0; i < u.cnt; i++) {
		d.push({
			rid: `virtual_${i}`,
			time: 0, step: 0,
			cost: 0, dist: 0,
			sid: ctx.s, status: 0
		})
	}

	ctx.body = { err: 0, data: d }
}
