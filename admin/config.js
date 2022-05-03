module.exports = async ctx => {
	if (!ctx.valid) {
		ctx.body = { err: -1 }
		return 'invalid token'
	}

	let p = ctx.request.body
	let d = {}
	for (let k in p) {
		if (p[k] === '') {
			d[k] = await PRD.con.get(k)
		} else {
			if (await PRD.con.set(k, p[k])) {
				d[k] = p[k]
			} else {
				d[k] = false
			}
		}
	}

	ctx.body = { err: 0, data: d }
}
