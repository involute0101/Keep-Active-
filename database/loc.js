const sql_clr_loc = 'DELETE FROM loc'
const sql_rid_loc = 'SELECT * FROM loc WHERE rid = $1'
const sql_add_loc = 'INSERT INTO loc VALUES ($1, $2, $3, $4, $5)'

exports.add = async (r, x, y, rt, it) => {
	return (await PR.db.query(
		sql_add_loc, r, x, y, rt, it
	)).rowCount
}

exports.rid = async(r) => {
	return (await PR.db.query(
		sql_rid_loc, r
	)).rows
}

exports.clr = async () => {
	return (await PR.db.query(
		sql_clr_loc
	)).rowCount
}
