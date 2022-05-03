const Router = require('koa-router')
const Crypt = require('../lib/crypt')

const router = new Router()

const get_list = [ 'result' ]
const post_list = [
	'login', 'recent', 'stats',
	'clear', 'config', 'addusr', 'addcnt',
	'getusr', 'getrun', 'getruns', 'getloc', 
]

router.use(async (ctx, next) => {
	if (ctx.request.body == undefined) {
		ctx.request.body = {}
	}
	if (ctx.request.fields == undefined) {
		ctx.request.fields = {}
	}
	ctx.t = ctx.cookies.get('token') // token in cookie
			|| ctx.query.token // token in url query string
			|| ctx.headers.token // token in headers
			|| ctx.request.body.token // token in html body
			|| ctx.request.fields.token // token in form data

	ctx.u = ctx.headers['user-agent']
	ctx.p = await PRD.con.get('admin')

	ctx.valid = false
	if (ctx.t !== undefined) {
		let t = Crypt.md5(`${ctx.u}-${ctx.p}`)
		if (t === ctx.t) { ctx.valid = true }
	}

	await next()
})

for (let i of get_list) {
	router.get(`/${i}`, require(`./${i}`))
}
for (let i of post_list) {
	router.post(`/${i}`, require(`./${i}`))
}

router.all('*', ctx => {
	let app = PR.info.name
	let ver = PR.info.version
	ctx.body = `${app}/${ver}`
	ctx.status = 404
})

exports.routes = router.routes()
exports.methods = router.allowedMethods()
