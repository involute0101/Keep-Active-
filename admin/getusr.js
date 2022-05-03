module.exports = async ctx => {
	if (!ctx.valid) {
		ctx.body = { err: -1 }
		return 'invalid token'
	}

	let mode = ctx.request.body.mode
	let sid = ctx.request.body.sid
	let name = ctx.request.body.name
	let limit = ctx.request.body.limit
	let offset = ctx.request.body.offset

	if (mode === undefined) {
		ctx.body = { err: 1 }
		return 'incomplete args'
	}

	let sql = `SELECT ${mode == 'count' ? 'COUNT(*) AS cnt' : '*'} FROM usr `

	if (sid !== undefined) {
		sql += 'WHERE sid = $1 '
	} else {
		sid = 1
		sql += 'WHERE 1 = $1 '
	}

	if (name !== undefined) {
		sql += 'AND name = $2 '
	} else {
		name = 1
		sql += 'AND 1 = $2 '
	}

	if (mode != 'count') {
		sql += 'ORDER BY sid '

		if (limit != undefined) {
			limit = parseInt(limit)
			sql += `LIMIT ${limit} `
		}

		if (offset != undefined) {
			offset = parseInt(offset)
			sql += `OFFSET ${offset} `
		}
	}

	let r = await PRD.query(sql, sid, name)
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
