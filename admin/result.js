const XLSX = require('xlsx')
const { tmpdir } = require('os')
const { createReadStream } = require('fs')

const sheet_to_workbook = (sheet, opts) => {
	let n = opts && opts.sheet ? opts.sheet : 'S1'
	let sheets = {}; sheets[n] = sheet
	return { SheetNames: [n], Sheets: sheets }
}
const aoa_to_workbook = (data, opts) => {
	return sheet_to_workbook(
		XLSX.utils.aoa_to_sheet(data, opts), opts
	)
}

module.exports = async ctx => {
	if (!ctx.valid) {
		ctx.body = { err: -1 }
		return 'invalid token'
	}

	let d = [[ '姓名', '学号', '次数' ]]
	let us = await PRD.usr.all()
	let rs = await PRD.run.cnt()
	let cnt = {}

	for (let i of rs) {
		let cnt1 = parseInt(us[i.sid].cnt)
		let cnt2 = parseInt(i.cnt)
		cnt[i.sid] = cnt1 + cnt2
	}

	for (let s in us) {
		d.push([ us[s].name, us[s].sid, cnt[s] ])
	}

	let wb = aoa_to_workbook(d)
	let p = `${tmpdir()}/${Date.now()}.xlsx`
	XLSX.writeFile(wb, p)

	ctx.set('Content-disposition', 'attachment; filename=result.xlsx')
	ctx.body = createReadStream(p)
}
