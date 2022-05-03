module.exports = async ctx => {
	if (!ctx.valid) {
		ctx.body = { err: -1 }
		return 'invalid token'
	}

	let mode = ctx.request.body.mode
	let type = ctx.request.body.type
	let sid = ctx.request.body.sid
	let from = ctx.request.body.from
	let to = ctx.request.body.to
	let limit = ctx.request.body.limit
	let offset = ctx.request.body.offset

	if (mode === undefined || type === undefined) {
		ctx.body = { err: 1 }
		return 'incomplete args'
	}

	let sql = `SELECT ${mode == 'count' ? 'COUNT(*) AS cnt' : '*'} FROM run `

	switch (parseInt(type)) {
	case 1: sql += 'WHERE status = 0 '; break
	case 2: sql += 'WHERE status > 0 '; break
	case 3: sql += 'WHERE status >= 0 '; break
	case 4: sql += 'WHERE status = -1 '; break
	case 5: sql += 'WHERE status <= 0 '; break
	case 6: sql += 'WHERE status != 0 '; break
	default: sql += 'WHERE 1 = 1 '
	}

	if (from !== undefined) {
		from = parseInt(from)
		sql += `AND time >= ${from} `
	}
	if (to !== undefined) {
		to = parseInt(to)
		sql += `AND time <= ${to} `
	}

	if (sid !== undefined) {
		sql += 'AND sid = $1 '
	} else {
		sid = 1
		sql += 'AND 1 = $1 '
	}

	if (mode != 'count') {
		sql += 'ORDER BY time '

		if (limit != undefined) {
			limit = parseInt(limit)
			sql += `LIMIT ${limit} `
		}

		if (offset != undefined) {
			offset = parseInt(offset)
			sql += `OFFSET ${offset} `
		}
	}

	let r = await PRD.query(sql, sid)
	if (mode == 'count') {
		ctx.body = {
			err: 0,
			count: r.rows[0].cnt
		}
	} else {
		ctx.body = {
			err: 0,
			detail: r.rows
		}
	}
}
