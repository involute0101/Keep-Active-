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
		let n = req.name || ''
		let b = req.birth || ''
		let g = parseInt(req.sex) ? 1 : 0

		await PRD.usr.del(s)
		let r = await PRD.usr.add(s, n, b, g)
		ctx.body = { err: r ? 0 : 1 }
	} else if (req.files) {
		let s, n, b, g, cnt = 0
		try {
			for (let f in req.files) {
				let wb = XLSX.readFile(req.files[f].path)
				for (let sn of wb.SheetNames) {
					let ws = wb.Sheets[sn]
					let lines = XLSX.utils.sheet_to_json(ws)
					for (let obj of lines) {
						s = n = b = g = null
						for (let k in obj) {
							if (/(号)/i.test(k)) {
								let _ = obj[k]
								s = _.replace(/\s/g, '')
							}
							if (/(名)/i.test(k)) {
								let _ = obj[k]
								n = _.replace(/\s/g, '')
							}
							if (/(日)/i.test(k)) {
								let _ = obj[k]
								_ = _.replace(/[^0-9]/g, '')
								b = _.substr(0, 8)
							}
							if (/(性)/i.test(k)) {
								g = /(男)/i.test(obj[k])
							}
						}
						if (isNull(s) || isNull(n)) { continue }
						if (isNull(b) || isNull(g)) { continue }

						await PRD.usr.del(s)
						cnt += await PRD.usr.add(s, n, b, g)
					}
				}
			}
		} catch(e) {
			ctx.body = { err: 1, msg: e.message }
			return 'invalid file / insert error'
		}
		ctx.body = { err: 0, count: cnt }
	} else {
		ctx.body = { err: 1, msg: 'invalid request' }
	}
}
