const moment = require('moment')

exports.stamp = () => Date.now()
exports.diff = t => Date.now() - t
exports.date = () => (new Date).getDate()
exports.ymd = () => moment().format('YYYY-MM-DD')
exports.fmt = f => moment().format(f)

exports.valid = async () => {
	const ts = Date.now()
	let st = await PRD.con.get('stime')
	let et = await PRD.con.get('etime')
	if (ts < st || ts > et) { return false }
	let h = (new Date).getHours()
	let m = (new Date).getMinutes()
	let n = 2 * h + (m >= 30)
	let p = await PRD.con.get('period')
	while (n--) { p = parseInt(p / 2) }
	return (p & 1) != 0
}
