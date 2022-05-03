module.exports = async ctx => {
	if (!ctx.valid) {
		ctx.body = { err: -1 }
		return 'invalid token'
	}

	let type = parseInt(ctx.request.body.type)
	let from = parseInt(ctx.request.body.from)
	let interval = parseInt(ctx.request.body.interval)
	let count = parseInt(ctx.request.body.count)

	if (!type || !from || !interval || !count) {
		ctx.body = { err: 1 }
		return 'incomplete args'
	}

	let sql = 'SELECT COUNT(*) AS cnt FROM run '
	switch (parseInt(type)) {
	case 1: sql += 'WHERE status = 0 '; break
	case 2: sql += 'WHERE status > 0 '; break
	case 3: sql += 'WHERE status >= 0 '; break
	case 4: sql += 'WHERE status = -1 '; break
	case 5: sql += 'WHERE status <= 0 '; break
	case 6: sql += 'WHERE status != 0 '; break
	default: sql += 'WHERE 1 = 1 '
	}

	let data = []
	while (count--) {
		let to  = from + interval
		let _ = `AND ${from} <= time AND time < ${to}`
		let cnt = (await PRD.query(sql + _)).rows[0].cnt
		data.push({ from, to, count: parseInt(cnt) })
		from += interval
	}

	ctx.body = { err: 0, data }
}
