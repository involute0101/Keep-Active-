const sql_clr_user = 'DELETE FROM usr'
const sql_all_user = 'SELECT * FROM usr'
const sql_del_user = 'DELETE FROM usr WHERE sid = $1'
const sql_cnt_user = 'SELECT COUNT(*) AS cnt FROM usr'
const sql_add_user = 'INSERT INTO usr VALUES ($1, $2, $3, $4)'
const sql_inc_user = 'UPDATE usr SET cnt = cnt + $2 WHERE sid = $1'

exports.all = async () => {
	return (await PR.db.query(
		sql_all_user
	)).rows
}

exports.add = async (s, n, b, g) => {
	return (await PR.db.query(
		sql_add_user, s, n, b, g
	)).rowCount
}

exports.cnt = async () => {
	return (await PR.db.query(
		sql_cnt_user
	)).rows[0].cnt
}

exports.clr = async () => {
	return (await PR.db.query(
		sql_clr_user
	)).rowCount
}

exports.del = async (s) => {
	return (await PR.db.query(
		sql_del_user, s
	)).rowCount
}

exports.inc = async (s, c) => {
	return (await PR.db.query(
		sql_inc_user, s, c
	)).rowCount
}
