const Router = require('koa-router')
const Crypt = require('../lib/crypt')
const Time = require('../lib/time')

const router = new Router()

const request_list = [
	'login', 'info',
	'start', 'end',
	'report', 'record'
]

let req_pool = {}
exports.init = () => {
	for (let i of request_list) {
		req_pool[`/${i}`] = {}
	}
}
exports.init()

router.use(async (ctx, next) => {
	let p = ctx.request.body
	let h = ctx.headers
	if ('token' in p) {
		ctx.s = Crypt.decrypt(p.token)
		if (ctx.s === false) {
			ctx.status = 403
			return 'invalid token'
		}
		if (ctx.url in req_pool) {
			if (p.token in req_pool[ctx.url]) {
				let lst = req_pool[ctx.url][p.token]
				if (Time.diff(lst) <= 200) {
					ctx.status = 403
					return 'too frequent'
				}
			}
			req_pool[ctx.url][p.token] = Time.stamp()
		}
	} else { ctx.s = false }
	if ('v' in h) {
		ctx.v = h.v == Crypt.vv(ctx.s)
	} else { ctx.v = false }

	await next()
})

for (let i of request_list) {
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
