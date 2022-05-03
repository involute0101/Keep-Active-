const Crypt = require('../lib/crypt')

module.exports = async ctx => {
	let _vp = ctx.headers.vp
	let _vs = ctx.headers.vs
	let sid = ctx.request.body.sid
	let pwd = ctx.request.body.pwd

	let av = parseInt(ctx.headers.a)
	let iv = parseInt(ctx.headers.i)

	if (isNaN(av) && isNaN(iv)) {
		ctx.body = { err: 103 }
		return 'data incomplete'
	}

	if (av < await PRD.con.get('minav')) {
		ctx.body = {
			err: 100,
			d: await PRD.con.get('downa')
		}
		return 'old version'
	}

	if (!(_vp && _vs && sid && pwd)) {
		ctx.body = { err: 103 }
		return 'data incomplete'
	}

	let u = await PRD.usr.sid(sid)
	if (u === false) {
		ctx.body = { err: 101 }
		return 'no such user'
	}

	if (u.birth !== pwd) {
		ctx.body = { err: 102 }
		return 'wrong password'
	}

	ctx.body = {
		err: 0, vp: Crypt.vp(sid), vs: Crypt.vs(sid),
		vv: Crypt.chash(_vp, PR.vh, _vs),
		token: Crypt.encrypt(sid)
	}
}
