const XLSX = require('xlsx')
const { isNull } = require('util')

module.exports = async ctx => {
	if (!ctx.valid) {
		ctx.body = { err: -1 }
		return 'invalid token'
	}

	let req = ctx.request.body
	if (req.sid !== undefined) {
		let s = req.sid
		let c = parseInt(req.cnt)
		if (isNaN(c)) {
			ctx.body = { err: 1 }
			return 'cnt not valid'
		}

		let r = await PRD.usr.inc(s, c)
		ctx.body = { err: r ? 0 : 1 }
	} else if (req.files) {
		let s, c, cnt = 0
		try {
			for (let f in req.files) {
				let wb = XLSX.readFile(req.files[f].path)
				for (let sn of wb.SheetNames) {
					let ws = wb.Sheets[sn]
					let lines = XLSX.utils.sheet_to_json(ws)
					for (let obj of lines) {
						s = c = null
						for (let k in obj) {
							if (/(号)/i.test(k)) {
								let _ = obj[k]
								s = _.replace(/\s/g, '')
							}
							if (/(次)/i.test(k)) {
								c = parseInt(obj[k])
								if (isNaN(c)) { c = 0 }
							}
						}

						if (isNull(s) || isNull(c)) { continue }
						cnt += await PRD.usr.inc(s, c)
					}
				}
			}
		} catch(e) {
			ctx.body = { err: 1, msg: e.message }
			return 'invalid file / insert error'
		}
		ctx.body = { err: 0, count: cnt }
	}
}
