const info_list = [
	'stime', 'etime',
	'count', 'continue',
	'mint', 'mina', 'mins',
	'maxt', 'maxa', 'maxs',
	'goal', 'period', 'region'
]
const parse_list = ['region']

module.exports = async ctx => {
	let u = await PRD.usr.sid(ctx.s)

	if (!(ctx.s || u)) {
		ctx.body = { err: 201 }
		return 'invalid user'
	}

	if (ctx.v === false) {
		ctx.body = { err: 202 }
		return 'man in the middle'
	}

	let data = { err: 0, name: u.name }
	data.dist = await PRD.con.get(u.sex ? 'mdist' : 'wdist')
	for (let i of info_list) { data[i] = await PRD.con.get(i) }
	for (let i of parse_list) { data[i] = JSON.parse(data[i]) }

	ctx.body = data
}
