const Time = require('../lib/time')
const Graph = require('../lib/graphics')

module.exports = async ctx => {
	if (!ctx.valid) {
		ctx.body = { err: -1 }
		return 'invalid token'
	}

	let n = ctx.request.body.num
	n = parseInt(n)
	if (isNaN(n)) { n = 50 }

	let ps = await PRD.con.get('region')
	ps = JSON.parse(ps)

	let sql = `
		SELECT rid, sid, time FROM run
		WHERE date = '${Time.ymd()}'
			AND status = -1
		ORDER BY time DESC LIMIT ${n}
	`
	let rs = (await PRD.query(sql)).rows

	let d = []
	for (let i of rs) {
		sql = `
			SELECT lng, lat, rec_time FROM loc
			WHERE rid = '${i.rid}'
			ORDER BY rec_time DESC LIMIT 1
		`
		let r = (await PRD.query(sql)).rows
		if (r.length > 0) {
			let x = r[0].lng,
				y = r[0].lat,
				rn = 'unknown'
			for (let _ of ps) {
				if (Graph.pip(x, y, _.shape)) {
					rn = _.name
					break
				}
			}
			d.push({
				sid: i.sid,
				lng: r[0].lng,
				lat: r[0].lat,
				time: r[0].rec_time,
				region: rn
			})
		}
	}

	ctx.body = { err: 0, data: d }
}
