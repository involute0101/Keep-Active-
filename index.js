global.PR = {
	'info': require('./package.json'),
	'dbcon': require('./config.json')
}
global.PRD = require('./database')

const Koa = require('koa')
const Body = require('koa-body')
const Schedule = require('node-schedule')

const Auser = require('./auser')
const Admin = require('./admin')
const Crypt = require('./lib/crypt')
const Log = require('./lib/log')

const app_user = new Koa()
const app_admin = new Koa()

const opt = { multipart: true }

app_user
	.use(Body())
	.use(Log.koa_stat)
	.use(Auser.routes)
	.use(Auser.methods)
app_admin
	.use(Body(opt))
	.use(Log.koa_stat)
	.use(Admin.routes)
	.use(Admin.methods)

{(async () => {
	await PRD.init()
	await Crypt.init()

	Schedule.scheduleJob(
		'PR Daily Job',
		'0 1 * * *',
		async () => {
			Log.info('Daily Update')
			await PRD.make_cache()
			await Crypt.init()
			Auser.init()
		}
	)

	app_user.listen(6883)
	app_admin.listen(6884)

	Log.info('Cert hash:', PR.vh)
	Log.succ('User API port:', 6883)
	Log.succ('Admin API port:', 6884)
	Log.text('-- service is running --')
})()}
