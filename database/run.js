const sql_clr_run = 'DELETE FROM run'
const sql_day_run = 'SELECT * FROM run WHERE date = $1'
const sql_sum_run = 'SELECT SUM(ABS($1)) AS sum FROM run'
const sql_usr_run = 'SELECT * FROM run WHERE sid = $1 AND status != -1'
const sql_add_run = 'INSERT INTO run (rid, sid, date, time) VALUES ($1, $2, $3, $4)'
const sql_cnt_run = 'SELECT sid, COUNT(rid) AS cnt FROM run WHERE status = 0 GROUP BY sid'
const sql_set_run = 'UPDATE run SET (cost, dist, step, status) = ($2, $3, $4, $5) WHERE rid = $1'

exports.day = async d => {
	return (await PR.db.query(
		sql_day_run, d
	)).rows
}

exports.clr = async () => {
	return (await PR.db.query(
		sql_clr_run
	)).rowCount
}

exports.usr = async s => {
	return (await PR.db.query(
		sql_usr_run, s
	)).rows
}

exports.add = async (r, s, d, t) => {
	return (await PR.db.query(
		sql_add_run, r, s, d, t
	)).rowCount
}

exports.set = async (r, c, d, f, s) => {
	return (await PR.db.query(
		sql_set_run, r, c, d, f, s
	)).rowCount
}

exports.cnt = async () => {
	return (await PR.db.query(
		sql_cnt_run
	)).rows
}

exports.sum = async k => {
	if (k == 'step' || k == 'dist') {
		return (await PR.db.query(
			sql_sum_run.replace('$1', k)
		)).rows
	} else { return [{ sum: 0 }] }
}
