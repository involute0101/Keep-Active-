const Crypt = require('../lib/crypt')

module.exports = async ctx => {
	if (ctx.request.body.pwd === ctx.p) {
		let t = Crypt.md5(`${ctx.u}-${ctx.p}`)
		ctx.cookies.set('token', t)
		ctx.body = { err: 0, token: t }
	} else {
		ctx.body = { err: 1 }
	}
}
