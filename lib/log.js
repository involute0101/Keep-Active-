const Time = require('./time')
const tf = '[[]YYYY-MM-DD HH:mm:ss.SSS[]]'

exports.text = (... args) => {
	console.log(... args)
}

exports.info = (... args) => {
	console.log(
		Time.fmt(tf),
		'info:\x1b[34m',
		... args,
		'\x1b[0m'
	)
}

exports.warn = (... args) => {
	console.log(
		Time.fmt(tf),
		'warn:\x1b[33m',
		... args,
		'\x1b[0m'
	)
}

exports.succ = (... args) => {
	console.log(
		Time.fmt(tf),
		'succ:\x1b[32m',
		... args,
		'\x1b[0m'
	)
}

exports.error = (... args) => {
	console.log(
		Time.fmt(tf),
		'error:\x1b[31m',
		... args,
		'\x1b[0m'
	)
}

exports.koa_stat = async (ctx, next) => {
	const s = Time.stamp()
	await next()
	const ms = Time.stamp() - s
	let log = `HTTP ${ctx.method} ${ctx.url}`
	log = `${log} - STATUS ${ctx.status} ${ms}ms`
	if (ctx.status >= 400) {
		exports.error(log)
	} else if (ctx.status >= 300) {
		exports.warn(log)
	} else if (ctx.status >= 200) {
		exports.succ(log)
	} else { exports.info(log) }

	let res = JSON.stringify(ctx.body)
	if (typeof res != 'string') { return }
	res = res.replace(/\s/g, '')
	if (res.length > 74) {
		res = res.substr(0, 70)
		res = `${res} ...`
	}
	if (ctx.s !== undefined) {
		res = `s: ${ctx.s}, r: ${res}`
	} else {
		res = `v: ${ctx.valid}, r: ${res}`
	}
	exports.text(res)
}
